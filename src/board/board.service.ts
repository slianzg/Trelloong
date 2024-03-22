
import { BadRequestException, ConflictException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/createBoard.dto';
import { UpdatedBoardDto } from './dto/updatedBoard.dto';
import { Member } from 'src/member/entities/member.entity';
import { DeleteBoardDto } from './dto/deleteBoard.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { SendEmailService } from 'src/utils/sendEmail.service';
import { InviteBoardDto } from './dto/inviteBoard.dto';
import { Role } from 'src/types/role.type';
import { AuthConfirmDto } from './dto/authConfirm.dto';

@Injectable()
export class BoardService {
    constructor (
        @InjectRepository(Board)
        private boardRepository : Repository<Board>,
        @InjectRepository(User)
        private userRepository : Repository<User>,
        @InjectRepository(Member)
        private memberRepository : Repository<Member>,
        private sendEmailService : SendEmailService
        ) {}
    
    // 보드 생성
    async createBoard (createBoardDto : CreateBoardDto, userId : number) {
        const boardInfo = await this.boardRepository.save({
            boardName : createBoardDto.boardName,
            boardDescription : createBoardDto.boardDescription,
            boardColor : createBoardDto.boardColor,
            user : { userId }   // 왜 userId,boardId까지 끌고오는 거지..?
        })
    await this.memberRepository.save({
        userId,
        boardId : boardInfo.boardId,
        role : Role.Admin
    })
        return boardInfo
    }

    // 보드 수정
    async updatedBoard (boardId : number, updatedBoardDto : UpdatedBoardDto, userId : number) {
        const { boardName, boardDescription, boardColor } = updatedBoardDto

        // 3칸 다 비어 있을 경우
        if (!boardName && !boardDescription && !boardColor) {
            throw new BadRequestException ('수정사항이 없습니다.')
        }

        // 보드 멤버도 아닐 경우 입구컷(보드 가드 작성전 까지만)
        const boardMember = await this.memberRepository.findOne({
            where : { userId, boardId }
        })
        if (!boardMember) {
            throw new NotFoundException ('보드 멤버가 아닙니다.')
        }
        // 보드 존재 여부
        const findBoard = await this.boardRepository.findOne({
            where : {
                boardId : +boardId
            }
        })
        if (!findBoard) {
            throw new NotFoundException ('수정하려는 보드가 존재하지 않습니다.')
        }
        // 어드민만 수정 가능
        const findAminBoard = await this.memberRepository.findOne({
            where : {
                boardId,
                userId,
                role : Role.Admin
            }
        })
        if (!findAminBoard) {
            throw new NotAcceptableException ('어드민인 보드만 수정이 가능합니다.')
        }

        await this.boardRepository.update(boardId,{
            boardName,
            boardDescription,
            boardColor
        })
    }

    // 보드 삭제
    async deleteBoard (user : User, boardId : number, deleteBoardDto : DeleteBoardDto) {
        if (!boardId) {
            throw new NotFoundException ('삭제 하려는 보드가 존재하지 않습니다.')
        }
        // 보드 멤버도 아닐 경우 입구컷(보드 가드 작성전 까지만)
        const boardMember = await this.memberRepository.findOne({
            where : { userId : user.userId, boardId }
        })
        if (!boardMember) {
            throw new NotFoundException ('보드 멤버가 아닙니다.')
        }
        // 어드민만 수정 가능
        const findAminBoard = await this.memberRepository.findOne({
            where : {
                boardId,
                userId : user.userId,
                role : Role.Admin
            }
        })
        if (!findAminBoard) {
            throw new NotAcceptableException ('어드민인 보드만 수정이 가능합니다.')
        }
        // 삭제하기 위한 비밀번호 검증
        const savedPassword = await this.userRepository.findOne({
            where : {
                email : user.email
            },
            select : {
                password : true
            }
        })

        if (!(await bcrypt.compare(deleteBoardDto.password, savedPassword.password))) {
            throw new UnauthorizedException('비밀번호를 확인해주세요.');
        }
        this.boardRepository.delete({
            boardId : boardId
        })
    }

    // 보드 목록
    async boardList (userId : number) {
    const boardListUp = await this.boardRepository.find({
        where : {
            userId
        },
        select : {
            boardId : true,
            boardName : true,
            boardDescription : true
        } 
    })
    return { boardListUp }
    }

    // 멤버 초대
    async inviteMember (boardId : number, inviteBoardDto : InviteBoardDto, userId : number) {
        // 보드 멤버도 아닐 경우 입구컷(보드 가드 작성전 까지만)
        const boardMember = await this.memberRepository.findOne({
            where : { userId, boardId }
        })
        if (!boardMember) {
            throw new NotFoundException ('보드 멤버가 아닙니다.')
        }
        // 본인이 어드민인 보드에 초대하는 것이 맞는지 확인
        const findOneBoard = await this.memberRepository.findOne({
            where : {
                boardId,
                userId : userId,
                role : Role.Admin
            }
        })
        if (!findOneBoard) {
            throw new NotAcceptableException ('어드민인 보드만 멤버 초대가 가능합니다.')
        }
        const inviteUser = await this.userRepository.findOne({
            where : {
                email : inviteBoardDto.email
            },
            select : {
                userId : true,
                email : true
            }
        })
    if (!inviteUser) {
        throw new NotFoundException ('초대하려는 유저가 존재하지 않습니다.')
    }

    const randomNum = () => {   // 랜덤한 숫자로 구성된 토큰 생성
        return Math.floor(1000 + Math.random() * 9000);
    };
    const token = randomNum();
    await this.memberRepository.save({
        userId : inviteUser.userId,
        boardId : boardId,
        role : Role.User,   // 초대 대기 상태
        verificationToken : token
    })
    await this.sendEmailService.sendInvitationEmail(inviteUser.email, token)
    }

    // 인증 확인
    async confirmToken (authConfirmDto : AuthConfirmDto, userId : number) {
        const halfMember = await this.userRepository.findOne({
            where : {
                email : authConfirmDto.email,
                userId
            },
            select : {
                userId : true,
            }
        })

        // 대리 인증 방지
        if (!halfMember) {
            throw new ConflictException ('존재 하지 않는 이메일이거나 본인만 인증이 가능합니다.')
        }

        const member = await this.memberRepository.findOne({
            where : {
                userId : halfMember.userId,
                verificationToken : authConfirmDto.verificationToken
            }
        })
        
        if (!member) {
            throw new ConflictException ('인증번호가 일치하지 않습니다.')
        }
        await this.memberRepository.update(member.memberId,{
            role : Role.Member
        })
    }
}