import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsService } from './column.service';


describe('ColumnService', () => {
  let service: ColumnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColumnsService],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
