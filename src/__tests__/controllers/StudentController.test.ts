import { Student } from "../../entities/Student";
import { StudentController } from "../../controllers/StudentController";

import { getMockReq, getMockRes } from "@jest-mock/express";
import "regenerator-runtime/runtime";
import { Repository } from "typeorm";
import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { Builder } from "builder-pattern";

let mockStudentRepository: MockProxy<Repository<Student>>;

let studentController: any; // SUT

beforeAll(() => {
  mockStudentRepository = mock<Repository<Student>>();
  studentController = StudentController(mockStudentRepository);
});

afterEach(() => {
  mockReset(mockStudentRepository);
});

test("getAll - 200", async () => {
  // setup - data
  const students = [
    Builder(Student)
      .enrollmentId(1)
      .firstNames("Pedro")
      .lastNames("Pool")
      .birthDate(new Date("2021-01-01"))
      .sex("M")
      .enrollmentDate(new Date("2017-01-01"))
      .build(),
    Builder(Student)
      .enrollmentId(2)
      .firstNames("Juan")
      .lastNames("Molina")
      .birthDate(new Date("2021-01-01"))
      .sex("M")
      .enrollmentDate(new Date("2017-01-01"))
      .build(),
  ];

  // setup - mocks
  mockStudentRepository.find.mockReturnValueOnce(Promise.resolve(students));

  const mockReq = getMockReq();
  const { res: mockRes } = getMockRes();

  // exercise
  await studentController.getAll(mockReq, mockRes);

  // verify - mocks
  expect(mockStudentRepository.find).toHaveBeenCalledTimes(1);

  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith(students);
});

test("getById - 200", async () => {
  // setup - data
  const student = Builder(Student)
    .enrollmentId(1)
    .firstNames("Pedro")
    .lastNames("Pool")
    .birthDate(new Date("2021-01-01"))
    .sex("M")
    .enrollmentDate(new Date("2017-01-01"))
    .build();

  // setup - mocks
  mockStudentRepository.findOne.mockReturnValueOnce(Promise.resolve(student));

  const mockReq = getMockReq();
  mockReq.params.studentId = "1";
  const { res: mockRes } = getMockRes();

  // exercise
  await studentController.getById(mockReq, mockRes);

  // verify - mocks
  expect(mockStudentRepository.findOne).toHaveBeenCalledWith("1", {
    relations: ["course"],
  });

  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith(student);
});

test("create - 201", async () => {
  // setup - data
  const requestBody = {
    firstNames: "Pedro",
    lastNames: "Pool",
    birthDate: "2021-01-01",
    sex: "M",
    enrollmentDate: "2017-01-01",
  };
  const providedStudent: Student = Object.assign(new Student(), requestBody);
  const savedStudent: Student = Object.assign(new Student(), {
    ...providedStudent,
    enrollmentId: 1,
  });

  // setup - mocks
  mockStudentRepository.save.mockReturnValueOnce(Promise.resolve(savedStudent));
  // On actual execution, findOne returns the entity also with parsed dates.
  mockStudentRepository.findOne.mockReturnValueOnce(
    Promise.resolve(savedStudent)
  );

  const mockReq = getMockReq();
  const { res: mockRes } = getMockRes();
  mockReq.body = requestBody;

  // exercise
  await studentController.create(mockReq, mockRes);

  // verify - mocks
  expect(mockStudentRepository.save).toHaveBeenCalledWith(providedStudent);
  expect(mockStudentRepository.findOne).toHaveBeenCalledWith(1);

  expect(mockRes.status).toHaveBeenCalledWith(201);
  expect(mockRes.json).toHaveBeenCalledWith(savedStudent);
});

test("update - 200", async () => {
  // setup - data
  const requestBody = {
    sex: "F",
  };
  const fetchedStudent = Builder(Student)
    .firstNames("Pedro")
    .lastNames("Pool")
    .birthDate(new Date("2021-01-01"))
    .sex("M")
    .enrollmentDate(new Date("2017-01-01"))
    .build();
  const mergedReqBodyFetchedStudent = Builder(Student)
    .firstNames("Pedro")
    .lastNames("Pool")
    .birthDate(new Date("2021-01-01"))
    .sex("F")
    .enrollmentDate(new Date("2017-01-01"))
    .build();
  const savedStudent = Builder(Student)
    .enrollmentId(1)
    .firstNames("Pedro")
    .lastNames("Pool")
    .birthDate(new Date("2021-01-01"))
    .sex("F")
    .enrollmentDate(new Date("2017-01-01"))
    .build();
  const fetchedSavedStudent = Builder(Student)
    .enrollmentId(1)
    .firstNames("Pedro")
    .lastNames("Pool")
    .birthDate(new Date("2021-01-01"))
    .sex("F")
    .enrollmentDate(new Date("2017-01-01"))
    .build();

  // setup - mocks
  mockStudentRepository.findOne.mockReturnValueOnce(
    Promise.resolve(fetchedStudent)
  );
  mockStudentRepository.save.mockReturnValueOnce(Promise.resolve(savedStudent));
  // On actual execution, findOne returns the entity also with parsed dates.
  mockStudentRepository.findOne.mockReturnValueOnce(
    Promise.resolve(fetchedSavedStudent)
  );

  const mockReq = getMockReq();
  const { res: mockRes } = getMockRes();
  mockReq.body = requestBody;
  mockReq.params.studentId = "1";

  // exercise
  await studentController.update(mockReq, mockRes);

  // verify - mocks
  expect(mockStudentRepository.findOne).toHaveBeenCalledWith("1");
  expect(mockStudentRepository.save).toHaveBeenCalledWith(
    mergedReqBodyFetchedStudent
  );
  expect(mockStudentRepository.findOne).toHaveBeenCalledWith("1");

  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.json).toHaveBeenCalledWith(fetchedSavedStudent);
});

test("deleteById - 204", async () => {
  // setup - data
  const student = Builder(Student)
    .enrollmentId(1)
    .firstNames("Pedro")
    .lastNames("Pool")
    .birthDate(new Date("2021-01-01"))
    .sex("M")
    .enrollmentDate(new Date("2017-01-01"))
    .build();

  // setup - mocks
  mockStudentRepository.findOne.mockReturnValueOnce(Promise.resolve(student));

  const mockReq = getMockReq();
  mockReq.params.studentId = "1";
  const { res: mockRes } = getMockRes();

  // exercise
  await studentController.deleteById(mockReq, mockRes);

  // verify - mocks
  expect(mockStudentRepository.findOne).toHaveBeenCalledWith("1");
  expect(mockStudentRepository.delete).toHaveBeenCalledTimes(1);

  expect(mockRes.status).toHaveBeenCalledWith(204);
  expect(mockRes.json).toHaveBeenCalledTimes(1);
});
