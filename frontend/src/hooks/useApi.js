"use client";

import { useState, useEffect, useCallback } from "react";
import apiService from "../services/api";

// ------------------------------
// useApi Hook
// ------------------------------
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiService.request(endpoint, options);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (endpoint) {
      fetchData();
    }
  }, [endpoint, options]);

  return { data, loading, error };
};

// ------------------------------
// useCreateOrder Hook
// ------------------------------
export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.createOrder(orderData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

// ------------------------------
// useOrderStatus Hook
// ------------------------------
export const useOrderStatus = (orderNumber) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderStatus = async () => {
    if (!orderNumber) return;

    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getOrderStatus(orderNumber);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
  }, [orderNumber]);

  return { data, loading, error, refetch: fetchOrderStatus };
};

// ------------------------------
// useUserPosts Hook
// ------------------------------
export const useUserPosts = (username, platform) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    if (!username || !platform) {
      setPosts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await apiService.fetchUserPosts(username, platform);
      setPosts(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username, platform]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
};
