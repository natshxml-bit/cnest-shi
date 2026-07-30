import { ChapterService } from './chapter.service';
export declare class ChapterController {
    private readonly chapterService;
    constructor(chapterService: ChapterService);
    getChapterData(chapterId: string): Promise<any>;
}
