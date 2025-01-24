import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuditLogEvent } from './audit-log/audit-log-event/decorators/audit-log-event.decorator';

@Injectable()
export class RestExampleService {
    constructor(private readonly httpService: HttpService) { }

    @AuditLogEvent({
        eventType: "GET_POSTS_SERVICE",
        eventDescription: "Fetching posts from service",
        getDetails: (args, result) => ({
            numberOfPosts: result.length,
            firstPostTitle: result[0]?.title,
        }),
    })
    async getPost() {
        const response = await firstValueFrom(
            this.httpService.get(`https://jsonplaceholder.typicode.com/posts`),
        );
        return response.data;
    }

    async getPostById(postId: number) {
        const response = await firstValueFrom(
            this.httpService.get(`https://jsonplaceholder.typicode.com/posts/${postId}`),
        );
        return response.data;
    }
}
