import { APIRequestContext } from "@playwright/test";
import User from "../models/User";

export default class TodoAPi {
  async addTodo(request: APIRequestContext, user: User) {
    return request.post("/api/v1/tasks", {
      data: {
        isCompleted: false,
        item: "Learn playwright",
      },
      headers: {
        Authorization: `Bearer ${user.getAccessToken()}`,
      },
    });
  }
}
