import { FilterService } from './filter.service';
export declare class FilterController {
    private readonly filterService;
    constructor(filterService: FilterService);
    getFilteredManga(query: any): Promise<{
        status: boolean;
        data: {
            results: any;
            pagination: {
                page: number;
                total_page: any;
                has_next: boolean;
            };
        };
    }>;
    getGenres(): Promise<{
        id: any;
        name: any;
    }[]>;
    getByGenre(slug: string, page?: string): Promise<{
        status: boolean;
        data: {
            results: any;
            pagination: {
                page: number;
                total_page: any;
                has_next: boolean;
            };
        };
    }>;
}
