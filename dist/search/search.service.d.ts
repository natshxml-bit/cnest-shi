export declare class SearchService {
    search(q: string, page?: string): Promise<{
        status: boolean;
        data: {
            query: string;
            results: any;
            pagination: {
                page: number;
                total_page: any;
                has_next: boolean;
            };
        };
    }>;
}
