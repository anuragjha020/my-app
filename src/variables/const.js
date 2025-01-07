//API url
export const API_BASE_URL = `http://localhost:5000/api/events`;

//API CRUD url
export const API_ENDPOINTS = {
  create: `${API_BASE_URL}/add`,
  fetchAll: `${API_BASE_URL}/get`,
  fetchById: (id) => `${API_BASE_URL}/get/${id}`,
  update: (id) => `${API_BASE_URL}/update/${id}`,
  delete: (id) => `${API_BASE_URL}/delete/${id}`,
};

//avatar file size
export const maxSize = 5;

//static date
export const date = new Date();

//route for homepage
export const home = "/";

//route for create new event
export const Create = "/create-event";

//route for display all existing event
export const EventList = "/listEvents";

//route for single event by id
export const Event = "/event";
