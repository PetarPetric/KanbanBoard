import columnsAPI from "@/services/apiService/columnsAPI";

describe('testing column api service', () => {
  it('should get all columns', async () => {
    // mock columnsAPI.get response with multiple columns
    const mockResponse = {
      data: [
        {
          title: 'Random title',
          boardId: 0,
          id: 10,
        },
        {
          title: 'Random title 2',
          boardId: 0,
          id: 11,
        },
      ],
    };

    // mock columnAPI service with axios.get mock
    columnsAPI.get = vitest.fn().mockResolvedValue(mockResponse);
    
    const response = await columnsAPI.get();
    expect(response.data.length).toBeGreaterThan(0);
  });

  it('should get single column', async () => {
    // mock columnsAPI.getSingle response
    const mockResponse = {
      data: {
        title: "Random title",
        boardId: 0,
        id: 10
      }
    }
    // mock columnAPI service with axios.get mock
    columnsAPI.getSingle = vitest.fn().mockResolvedValue(mockResponse);

    const response = await columnsAPI.getSingle(10);
    expect(response.data.id).toEqual(10);
  });

  it('should create new column', async () => {
    // mock columnsAPI.create response
    const mockResponse = {
      data: {
        title: "Random title",
        boardId: 0,
        id: 10
      }
    }
    // mock columnAPI service with axios.post mock
    columnsAPI.create = vitest.fn().mockResolvedValue(mockResponse);

    const response = await columnsAPI.create({
      title: "Random title",
      boardId: 0,
      id: 10
    });
    expect(response.data.id).toEqual(10);
  });

  it('should update column', async () => {
    // mock columnsAPI.update response
    const mockResponse = {
      data: {
        title: "Random title",
        boardId: 0,
        id: 10
      }
    }
    // mock columnAPI service with axios.put mock
    columnsAPI.update = vitest.fn().mockResolvedValue(mockResponse);

    const response = await columnsAPI.update({
      title: "Random title",
      boardId: 0,
      id: 10
    }, 10);
    expect(response.data.id).toEqual(10);
  });

  it('should patch column', async () => {
    // mock columnsAPI.patch response
    const mockResponse = {
      data: {
        title: "Random title",
        boardId: 0,
        id: 10
      }
    }
    // mock columnAPI service with axios.patch mock
    columnsAPI.patch = vitest.fn().mockResolvedValue(mockResponse);

    const response = await columnsAPI.patch({
      title: "Random title",
      boardId: 0,
      id: 10
    }, 10);
    expect(response.data.id).toEqual(10);
  });

  it('should delete column', async () => {
    // mock columnsAPI.delete delete message
    const mockResponse = {
      data: {
        message: "Column deleted successfully"
      }
    }
    // mock columnAPI service with axios.delete mock
    columnsAPI.delete = vitest.fn().mockResolvedValue(mockResponse);

    const response = await columnsAPI.delete(10);
    expect(response.data.message).toEqual("Column deleted successfully");
  });

  it('should throw error', async () => {
    // mock columnsAPI.get error
    const mockError = new Error('Error');

    // mock columnAPI service with axios.delete mock
    columnsAPI.delete = vitest.fn().mockRejectedValue(mockError);

    try {
      await columnsAPI.delete(10);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
})