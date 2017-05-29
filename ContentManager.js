'use strict';

let request = require('request');

module.exports = class ContentManager {

    constructor(serviceUrl, bubbleId) {
        this.serviceUrl = serviceUrl;
        this.bubbleId = bubbleId;
    }

    _getBubbleId(bubbleId) {
        if(bubbleId) {
            return bubbleId;
        } else if(this.bubbleId) {
            return this.bubbleId;
        } else {
            throw Error('Content Manager Wrapper: No Bubble Id supplied');
        }
    }

    subscribe(productId, contextId, topicId, receivers, timeTrigger, bubbleId, subscriberId) {

        return new Promise((fulfill, reject) => {

            let subscriptionObj = {
                'productId': productId,
                'bubbleId': this._getBubbleId(bubbleId),
                'userId': contextId,
                'topicStates' : [{
                    'topicId': topicId
                }],
                'receivers': receivers,
                'subscriberId': subscriberId
            };

            //Add time trigger if exists
            if(typeof timeTrigger !== 'undefined' && timeTrigger !== null) {
                subscriptionObj.topicStates[0].timeTrigger = timeTrigger;
            }

            request({
                url: this.serviceUrl   + 'usersubscription',
                method: 'POST',
                json: true,
                body: subscriptionObj
            }, function (error, response){
                if (response.statusCode == 200) {
                    fulfill(response);
                } else {
                    reject(error);
                }
            });

        }); /// promise

    }

    unsubscribe(productId, contextId, subscriptionIds, isScheduledSubscription, bubbleId) {

        return new Promise((fulfill, reject) => {

            let subscriptionObj = {
                'productId': productId,
                'bubbleId': this._getBubbleId(bubbleId),
                'userId': contextId,
                'subscriptionIds': subscriptionIds
            };

            if(isScheduledSubscription === true) {
                subscriptionObj.isScheduled = true;
            }

            request({
                url: this.serviceUrl   + 'unsubscribe',
                method: 'POST',
                json: true,
                body: subscriptionObj
            }, function (error, response){
                if (response.statusCode == 200) {
                    fulfill(response);
                } else {
                    reject(error);
                }
            });

        }); /// promise

    }

    getUserSubscriptions(productId, contextId, bubbleId) {

        return new Promise((fulfill, reject) => {

            let subscriptionObj = {
                'productId': productId,
                'bubbleId': this._getBubbleId(bubbleId),
                'userId': contextId
            };

            request({
                url: this.serviceUrl   + 'getusertopicsofservice',
                method: 'POST',
                json: true,
                body: subscriptionObj
            }, function (error, response){
                if (response.statusCode == 200) {

                    fulfill(response.body);
                } else {
                    reject(error);
                }
            });

        }); /// promise

    }

    getAllTopics(bubbleId) {

        return new Promise((fulfill, reject) => {

            let requestObj = {
                'bubbleId': this._getBubbleId(bubbleId),
            };

            request({
                url: this.serviceUrl   + 'gettopicsofservice',
                method: 'GET',
                json: true,
                qs: requestObj
            }, function (error, response){
                if (response && response.statusCode === 200) {
                    fulfill(response.body.topics);
                } else {
                    reject(error);
                }
            });

        }); /// promise

    }

    sendMessages(messages, isScheduledSubscription, bubbleId) {

        return new Promise((fulfill, reject) => {

            if (messages.length > 0) {

                let requestObj = {
                    'bubbleId': this._getBubbleId(bubbleId),
                    'contentResources': messages
                };

                if(isScheduledSubscription === true) {
                    requestObj.isScheduled = true;
                }

                request({
                    url: this.serviceUrl   + 'pushcontent',
                    method: 'POST',
                    json: true,
                    body: requestObj
                }, function (error, response){
                    if (response.statusCode == 200) {
                        fulfill({
                            messages: messages,
                            response: response.body
                        });
                    } else {
                        if(error) {
                            reject(error);
                        } else {
                            reject(response.body);
                        }

                    }
                });

            } else {
                fulfill({
                    messages: messages,
                    response: ''
                });
            }

        }); /// promise

    }

}
