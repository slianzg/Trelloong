import { ConflictException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Boards } from './entities/board.entity';
import { CreateBoardDto } from './dto/createBoard.dto';
import { UpdatedBoardDto } from './dto/updatedBoard.dto';
import { Members } from 'src/member/entities/member.entity';
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
        @InjectRepository(Boards)
        private boardRepository : Repository<Boards>,
        @InjectRepository(User)
        private userRepository : Repository<User>,
        @InjectRepository(Members)
        private memberRepository : Repository<Members>,
        private sendEmailService : SendEmailService
        ) {}
    
    // 보드 생성
    async createBoard (createBoardDto : CreateBoardDto) {
    const boardInfo = await this.boardRepository.save({
            boardName : createBoardDto.name,
            boardDescription : createBoardDto.description,
            boardColor : createBoardDto.color
        })
        return boardInfo
    }

    // 보드 수정
    async updatedBoard (boardId : number, updatedBoardDto : UpdatedBoardDto) {
        const findBoard = await this.boardRepository.findOne({
            where : {
                boardId : +boardId
            }
        })
        
        if (!findBoard) {
            throw new NotFoundException ('수정하려는 보드가 존재하지 않습니다.')
        }

        const afterBoardInfo = await this.boardRepository.update(boardId,{
            boardName : updatedBoardDto.name,
            boardDescription : updatedBoardDto.description,
            boardColor : updatedBoardDto.color
        })
    return { afterBoardInfo }
    }

    // 보드 삭제
    async deleteBoard (user : User, boardId : number, deleteBoardDto : DeleteBoardDto) {
        if (!boardId) {
            throw new NotFoundException ('삭제 하려는 보드가 존재하지 않습니다.')
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
            boardId : +boardId
        })
    }

    // 보드 목록
    async boardList () {
    const boardListUp = await this.boardRepository.find({
        select : {
            boardId : true,
            boardName : true,
            boardDescription : true
        } 
    })
    return { boardListUp }
    }

    // 멤버 초대
    async inviteMember (boardId : number, inviteBoardDto : InviteBoardDto) {
        // 본인이 어드민인 보드에 초대하는 것이 맞는지 확인
        const findOneBoard = await this.memberRepository.findOne({
            where : {
                boardId : boardId,
                //userId : userId,
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
        // email : inviteUser.email,
        role : Role.User,   // 초대 대기 상태
        verificationToken : token
    })
    // await this.userRepository.save({
    //     email : inviteUser.email
    // })
    await this.sendEmailService.sendInvitationEmail(inviteUser.email, token)
    }

    // 인증 확인
    async confirmToken (authConfirmDto : AuthConfirmDto) {
        const halfMember = await this.userRepository.findOne({
            where : {
                email : authConfirmDto.email
            },
            select : {
                email : true,
                members : {
                    verificationToken : true
                }
            },
            relations : ['members']
        })
        if (!halfMember) {
            throw new ConflictException ('존재 하지 않는 이메일 입니다.')
        }
        if (halfMember.members[0].verificationToken !== authConfirmDto.verificationToken) {
            throw new ConflictException ('인증번호가 일치하지 않습니다.')
        }
        await this.memberRepository.update(halfMember.email,{
            role : Role.Member
        })
    }
}