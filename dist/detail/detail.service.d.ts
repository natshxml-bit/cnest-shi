export declare class DetailService {
    getDetail(mangaId: string): Promise<{
        status: boolean;
        data: any;
    }>;
}
