import { Course } from "../entities/Course";

import { Request, Response } from "express";
import { validate } from "class-validator";
import { TController } from "./types";

export const CourseController: TController<Course> = (courseRepository) => {
  const getAll = async (req: Request, res: Response) => {
    try {
      const fetchedCourses = await courseRepository.find();
      return res.status(200).json(fetchedCourses);
    } catch (error) {
      return res.status(500).json({ error: "Unexpected DB error" });
    }
  };

  const getById = async (req: Request, res: Response) => {
    const courseId = req.params.courseId;

    try {
      const fetchedCourse = await courseRepository.findOne(courseId);

      if (!fetchedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }
      return res.status(200).json(fetchedCourse);
    } catch (error) {
      return res.status(500).json({ error: "Unexpected DB error" });
    }
  };

  const create = async (req: Request, res: Response) => {
    const providedCourse = Object.assign(new Course(), req.body);

    const errors = await validate(providedCourse);

    if (errors.length > 0) {
      return res.status(400).json({ error: "Invalid course", errors });
    }

    try {
      const { id: savedCourseId } = await courseRepository.save(providedCourse);
      const savedCourse = await courseRepository.findOne(savedCourseId);
      return res.status(201).json(savedCourse);
    } catch (error) {
      return res.status(500).json({ error: "Unexpected DB error" });
    }
  };

  const update = async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    const providedCourse = req.body;

    try {
      const fetchedCourse = await courseRepository.findOne(courseId);

      if (!fetchedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      Object.assign(fetchedCourse, providedCourse);

      const errors = await validate(fetchedCourse);

      if (errors.length > 0) {
        return res.status(400).json({ error: "Invalid course", errors });
      }

      const { id: savedCourseId } = await courseRepository.save(fetchedCourse);
      const savedCourse = await courseRepository.findOne(savedCourseId);
      return res.status(200).json(savedCourse);
    } catch (error) {
      return res.status(500).json({ error: "Unexpected DB error" });
    }
  };

  const deleteById = async (req: Request, res: Response) => {
    const courseId = req.params.courseId;

    try {
      const fetchedCourse = await courseRepository.findOne(courseId);

      if (!fetchedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }
      await courseRepository.delete(courseId);
      return res.status(204).json(fetchedCourse);
    } catch (error) {
      return res.status(500).json({ error: "Unexpected DB error" });
    }
  };

  return { getAll, getById, create, update, deleteById };
};
