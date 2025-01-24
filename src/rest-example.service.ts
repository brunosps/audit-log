import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RestExampleService {
    constructor(private readonly httpService: HttpService) { }

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
