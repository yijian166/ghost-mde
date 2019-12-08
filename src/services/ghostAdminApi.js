import request from '@request';
import {PostStatus, handlePost} from '@config'
// import moment from 'moment'
// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// dayjs.extend(utc)

// const now = moment();

// console.log('now', now.utcOffset(480).format('YYYY-MM-DDTHH:mm:ss.SSSSZ'), now.utc().format('YYYY-MM-DDTHH:mm:ss.Z'))

// const s = dayjs.utc().format()
// console.log(1111,s, new Date().toISOString());
Date.prototype.toIsoString2 = function() {
	var tzo = -this.getTimezoneOffset(),
			dif = tzo >= 0 ? '+' : '-',
			pad = function(num) {
					var norm = Math.floor(Math.abs(num));
					return (norm < 10 ? '0' : '') + norm;
			};
	return this.getFullYear() +
			'-' + pad(this.getMonth() + 1) +
			'-' + pad(this.getDate()) +
			'T' + pad(this.getHours()) +
			':' + pad(this.getMinutes()) +
			':' + pad(this.getSeconds()) +
			dif + pad(tzo / 60) +
			':' + pad(tzo % 60);
}

export default class GhostAdminApi {

	constructor(blogConfig) {
		this.blogConfig = blogConfig;
		this.postStatus = PostStatus;
	}

	async getSiteConfig() {
		const data = await request('site', this.blogConfig, {method: 'GET'})
		return data;
	}

	async getPosts(page, limit) {
			const { posts, meta: {pagination} } = await request('posts', this.blogConfig, {method: 'GET', params:{
				formats: ['html', 'mobiledoc'],
				page, limit
			}})
			return {
				...pagination,
				posts: (Array.isArray(posts) ? posts: []).map(item => handlePost(item))
			};
	}

	async delPost(id) {
		try {
			console.log('---delPost 01---')
			await request(`posts/${id}`, this.blogConfig,{method: 'DELETE'})
			return true
		} catch (error) {
			console.log('---delPost---', error)
			return false
		}
	}

	async savePost(post, markdown) {
		try {
			let url = 'posts';
			let method = 'POST';
			if (post.id) {
				url += `/${post.id}`;
				method = 'PUT';
				// const time = new Date().toISOString();
				// post.updated_at = time.slice(0, time.lastIndexOf('.')) + '.000Z'
			}else {
				delete post.updated_at
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
			
			post.mobiledoc = JSON.stringify(mobiledoc)
			const data = await request(url, this.blogConfig,{method, data: {
				posts: [post]
			}})
			if (!data || typeof data === 'object' && Array.isArray(data.errors)) {
				throw data.errors;
			}
			let newPost = null
			if (data && typeof data === 'object' && Array.isArray(data.posts) && data.posts.length > 0) {
				newPost = data.posts[0]
				const serverPost = await request(`posts/${newPost.id}`, this.blogConfig,{method : 'GET',params:{
					formats: ['html', 'mobiledoc'],
				}});// 多做这一步是为了，拿post的html
				if (serverPost && typeof serverPost === 'object' && Array.isArray(serverPost.posts) && serverPost.posts.length > 0) {
					newPost = serverPost.posts[0]
				}
			}
			// console.log('---serverPost', serverPost)
			return newPost;
		} catch (error) {
			console.warn('---savePost error---', error)
			throw error
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

	async getSlug(oldSlug) {
		if (!oldSlug) {
			throw('please input post slug')
		}
		const { slugs: [{slug}]} = await request(`posts/slug/${oldSlug}`,this.blogConfig, {method : 'GET'})
		return slug;
	}
}
