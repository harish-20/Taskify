import { create } from "zustand";
import { persist } from "zustand/middleware";
import taskActions from "./task.action";

const useTaskStore = create(persist(taskActions, { name: "task-store" }));

export default useTaskStore;
