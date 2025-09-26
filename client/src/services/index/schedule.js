import axios from "axios";

export const getSchedulesByIds = async (ids) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/schedules/getByIds', { ids });
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getAllSchedules = async (searchKeyword = "", page = 1, limit = 10) => {
  try {
    const { data, headers } = await axios.get(`http://localhost:5000/api/schedules?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`)

    return { data, headers };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSingleSchedule = async (slug) => {
  try {
    const { data } = await axios.get(`/api/schedules/${slug}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteSchedule = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`/api/schedules/${slug}`, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateSchedule = async ({ updatedData, slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`/api/schedules/${slug}`, updatedData, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createSchedule = async ({ newScheduleData, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`/api/schedules`, newScheduleData, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
