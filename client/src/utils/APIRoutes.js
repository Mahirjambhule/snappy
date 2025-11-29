// export const host = "http://localhost:3001";
export const host = "https://snappy-8ien.onrender.com"

export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const receiveMessageRoute = `${host}/api/messages/getmsg`;
export const uploadImageRoute = `${host}/api/messages/uploadimage`;
export const createGroupRoute = `${host}/api/groups/create`;
export const getGroupsRoute = `${host}/api/groups/getgroups`;
export const deleteMessageRoute = `${host}/api/messages/deletemsg`;