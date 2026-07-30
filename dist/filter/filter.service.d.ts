export declare class FilterService {
    getFilteredManga(filters: any): Promise<{
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
    getByGenre(genreSlug: string, page?: string): Promise<{
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
        status: boolean;
        data: {
            id: any;
            name: any;
        }[];
    }>;
}
