import store from '@/store'
import cache from './cache'
import {
	msg
} from './util'

let baseUrl = 'https://sxb2bmallapi.loveinway.com/customer-api/';

export default baseUrl;
export const request = (url,data,method,cacheName,time)=>{
	return new Promise((resolve, reject) => {
		if(time > 0){
			const cacheResult = cache.get(cacheName);
			if(cacheResult){
				resolve(cacheResult);
				return;
			}
		}
		
		uni.request({
			url:baseUrl+url,
			data:data,
			header:{
				'token':uni.getStorageSync('token') || '',
                // 'content-type':'application/x-www-form-urlencoded'
			},
			method: method || 'GET',
			success: (res) => {
				uni.hideLoading()
				if (Number(res.data.code) === 0) {
					resolve(res.data.data)
				} else if (Number(res.data.code) === 10021 || Number(res.data.code) === 10020) {
					uni.showToast({
						title: '登录过期，请重新登录',
						icon: 'none'
					})
					uni.clearStorageSync()
					// setTimeout(() => {
					// 	uni.navigateTo({
					// 		url: '/pages/Login/Login'
					// 	})
					// }, 1500)
					reject(res.data)
				} else {
					uni.showToast({
						title: res.data.msg || '请求失败',
						icon: 'none'
					})
					reject(res.data)
				}
				if(time > 0){
					cache.put(cacheName, res.data.data, time);
				}
			},
			fail: function(err) {
				uni.hideLoading()
				reject(err)
			}
		})

	})
}
