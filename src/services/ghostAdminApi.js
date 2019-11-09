import jsrsasign from 'jsrsasign';

function getToken(key, version = 'v3') {
	const [id, secret] = key.split(':');
	const oHeader = {
			"alg": "HS256",
			"kid": id, // ID from your API key
			"typ": "JWT"
	}
	const tNow = Math.floor(Date.now() / 1000)//jsrsasign.jws.IntDate.get('now');
	const tEnd = tNow + 60 * 5;//jsrsasign.jws.IntDate.get('now + 1day');
	const oPayload = {
			// Timestamps are seconds sine the unix epoch, not milliseconds
			"exp": tEnd, // Max 5 minutes after 'now'
			"iat": tNow, // 'now' (max 5 minutes after 'exp')
			"aud": `/${version}/admin/`
	};
	// oPayload.iss = "http://foo.com";
	// oPayload.sub = "mailto:mike@foo.com";
	// oPayload.nbf = tNow;
	// oPayload.iat = tNow;
	// oPayload.exp = tEnd;
	// oPayload.jti = "id123456";
	// oPayload.aud = "http://foo.com/employee";
	const sHeader = JSON.stringify(oHeader);
	const prvKey = {
			hex: secret
	}
	// let prvKey = ''
	// prvKey = jsrsasign.hextopem(secret)
	// prvKey = jsrsasign.KEYUTIL.getKey(prvKey);
	const sPayload = JSON.stringify(oPayload)
	const token = jsrsasign.jws.JWS.sign("HS256", sHeader, sPayload, prvKey);
	return token;
}

export const ISDEV = !__buildEnvIsProduction__;

export default class GhostAdminApi {

	constructor(blogConfig) {
		this.blogConfig = blogConfig;
	}

	async getPosts() {

		const result = await fetch(`${!ISDEV ? this.blogConfig.url : ''}/ghost/api/v3/admin/posts/`,{
			headers: new Headers({
				// 'Content-Type': 'application/json',
				Authorization: `Ghost ${getToken(this.blogConfig.key, this.blogConfig.version)}`
			})
		});

		const data = await result.json();
		return data;
	}
}
