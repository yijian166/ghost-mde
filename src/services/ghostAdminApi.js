import request from '@request';
export default class GhostAdminApi {

	constructor(blogConfig) {
		this.blogConfig = blogConfig;
		this.postStatus = {
			scheduled: "scheduled",
			published: "published",
			draft: "draft"
		}
	}

	async getPosts() {
		const data = request('posts', this.blogConfig, {method: 'GET', params:{
			formats: ['html', 'mobiledoc']
		}})
		return data;
	}

	async savePost(post, markdown) {
		try {
			let url = 'posts';
			let method = 'POST';
			if (post.id) {
				url += `/${post.id}`;
				method = 'PUT'
			}
			delete post.id;
			if (!post.status) {
				post.status = this.postStatus.draft
			}
			if (!post.title) {
				post.title = "(Untitled)"
			}
			
			const mobiledoc = {
				'version': '0.3.1',
				'markups':[],
				'atoms':[],
				'cards':[[
					'markdown',
					{
						// 'cardName':'card-markdown',
						markdown
					}
				]],
				'sections':[[10,0],[1,"p",[]]]//[[10, 0]]
			}
			post.updated_at = new Date();
			post.mobiledoc = JSON.stringify(mobiledoc)
			const data = request(url, this.blogConfig,{method, data: {
				posts: [post]
			}})
			if (typeof data === 'object' && Array.isArray(data.posts) && data.posts.length > 0) {
				return data.posts[0]
			}
			return null;
		} catch (error) {
			return null
		}
	
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
