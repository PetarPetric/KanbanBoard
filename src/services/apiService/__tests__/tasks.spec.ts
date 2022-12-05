import tasksAPI from '../tasksAPI';

describe('tasks api service', () => {
  it('should get tasks from one column', async () => {
    // mock tasksAPI.get response with multiple tasks
    const mockResponse = {
      data: [
        {
          title: 'Random title',
          description: '',
          columnId: 10,
          id: 10,
          taskPosition: 0,
        },
        {
          title: 'Random title 2',
          description: '',
          columnId: 10,
          id: 11,
          taskPosition: 1,
        },
      ],
    };

    // mock tasksAPI service with axios.get mock
    tasksAPI.get = vitest.fn().mockResolvedValue(mockResponse);

    const response = await tasksAPI.get(10);
    expect(response.data.length).toBeGreaterThan(0);
  });
})