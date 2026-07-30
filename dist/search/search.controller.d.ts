import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
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
