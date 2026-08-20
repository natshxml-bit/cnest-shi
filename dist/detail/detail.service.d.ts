export declare function fetchAllChapters(mangaId: string): Promise<any[]>;
export declare class DetailService {
    getDetail(mangaId: string): Promise<{
        status: boolean;
        data: any;
    }>;
}
