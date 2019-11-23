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

	async uploadImg(file) {
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('purpose', 'image');
			const data = await request('images/upload', this.blogConfig, {formData});
			console.log('---uploadImg---', data)
			if (typeof data === 'object' && Array.isArray(data.images) && data.images.length > 0) {
				return typeof data.images[0] === 'object' ? data.images[0].url : ''
			}
			return '';
		} catch (error) {
			return '';
		}
	
	}
}
