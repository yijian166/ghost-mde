import request from '@request';
export default class GhostAdminApi {

	constructor(blogConfig) {
		this.blogConfig = blogConfig;
	}

	async getPosts() {
		const data = request('posts', this.blogConfig, {method: 'GET', params:{
			formats: ['html', 'mobiledoc']
		}})
		return data;
	}
}
