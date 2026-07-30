import { DetailService } from './detail.service';
export declare class DetailController {
    private readonly detailService;
    constructor(detailService: DetailService);
    getDetail(mangaId: string): Promise<{
        status: boolean;
        data: any;
    }>;
}
