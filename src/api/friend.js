// 注意：不要加任何类型标注（: 类型），纯 JS 语法
import request from '@/utils/request';

// 1. 发送好友申请（移除参数类型 : number）
export const sendFriendRequest = (friendId) => {
  return request({
    url: 'friend-request/send/',
    method: 'POST',
    data: { friend_id: friendId }
  });
};

// 2. 获取收到的好友申请列表（移除返回值类型 Promise<xxx>）
export const getReceivedFriendRequests = () => {
  return request({
    url: 'friend-request/my/',
    method: 'GET'
  });
};

// 3. 处理好友申请（移除参数类型 : number, : boolean）
export const handleFriendRequest = (requestId, agree) => {
  return request({
    url: 'friend-request/handle/',
    method: 'POST',
    data: { request_id: requestId, agree }
  });
};

// 4. 取消发送的好友申请（移除参数类型 : number）
export const cancelFriendRequest = (friendId) => {
  return request({
    url: `friend-request/cancel/${friendId}/`,
    method: 'DELETE'
  });
};

// 5. 删除好友（移除参数类型 : number）
export const deleteFriend = (friendId) => {
  return request({
    url: `friend/delete/${friendId}/`,
    method: 'DELETE'
  });
};

// 6. 获取我的好友列表（移除返回值类型 Promise<xxx>）
export const getFriendList = () => {
  return request({
    url: 'chat/friends/',
    method: 'GET'
  });
};