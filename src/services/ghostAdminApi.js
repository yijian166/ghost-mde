import request from '@request';
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
		this.postStatus = {
			scheduled: "scheduled",
			published: "published",
			draft: "draft"
		}
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
				posts: (Array.isArray(posts) ? posts: []).map(item => {
					// const date = moment(item.updated_at);
					// console.log('===', date, date.utcOffset())
					let markdown = '';
					let supportMd = false;
					if (item && typeof item === 'object') {
						const { mobiledoc = "" } = item;
						const { cards } = JSON.parse(mobiledoc);
						if (Array.isArray(cards) && cards.length) {
							const [ [type, { markdown: _md }] ] = cards;
							// console.log('--', type, markdown)
							if (type === 'markdown' || type === 'card-markdown') {
								markdown = _md;
								supportMd = true;
							}
						}
					}
					item.markdown = markdown;
					item.supportMd = supportMd;
					return item;
				})
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

	async savePost(post, markdown, updated_at) {
		try {
			let url = 'posts';
			let method = 'POST';
			if (post.id) {
				url += `/${post.id}`;
				method = 'PUT';
				// const date = new Date()
				// post.updated_at = date//date.toIsoString2(); 2019-11-30T06:49:40.000Z
				// let time = new Date().toISOString();
				// post.updated_at = time.slice(0, time.lastIndexOf('.')) + '.000Z'
				post.updated_at = updated_at;
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
			if (typeof data === 'object' && Array.isArray(data.posts) && data.posts.length > 0) {
				return data.posts[0]
			}
			return null;
		} catch (error) {
			console.log('---savePost error---', error)
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
