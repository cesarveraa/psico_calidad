import axios from "axios";

export const getAllBookCategories = async (searchKeyword = "", page = 1, limit = 10) => {
  try {
    const { data, headers } = await axios.get(
      `/api/book-categories?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`
    );
    return { data, headers };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteBookCategory = async ({ bookCategoryId, token }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`/api/book-categories/${bookCategoryId}`, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  };

export const createBookCategory = async ({ token, title }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `/api/book-categories`,
      { title },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateBookCategory = async ({ token, title, bookCategoryId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `/api/book-categories/${bookCategoryId}`,
      { title },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSingleBookCategory = async ({ bookCategoryId }) => {
  try {
    const { data } = await axios.get(`/api/book-categories/${bookCategoryId}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
