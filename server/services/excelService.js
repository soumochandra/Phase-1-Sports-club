const ExcelJS = require("exceljs");

const createAthleteExcel = async (athletes) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Athletes");

  worksheet.columns = [
    {
      header: "Athlete ID",
      key: "id",
      width: 25,
    },
    {
      header: "First Name",
      key: "firstName",
      width: 20,
    },
    {
      header: "Last Name",
      key: "lastName",
      width: 20,
    },
    {
      header: "DOB",
      key: "dob",
      width: 15,
    },
    {
      header: "Age",
      key: "age",
      width: 10,
    },
    {
      header: "Age Group",
      key: "ageGroup",
      width: 15,
    },
    {
      header: "Gender",
      key: "gender",
      width: 15,
    },
    {
      header: "Mobile",
      key: "mobile",
      width: 15,
    },
    {
      header: "Email",
      key: "email",
      width: 30,
    },
    {
      header: "Guardian Name",
      key: "guardianName",
      width: 25,
    },
    {
      header: "Guardian Mobile",
      key: "guardianMobile",
      width: 18,
    },
    {
      header: "Guardian Relation",
      key: "guardianRelation",
      width: 20,
    },
    {
      header: "Address",
      key: "address",
      width: 35,
    },
    {
      header: "City",
      key: "city",
      width: 20,
    },
    {
      header: "State",
      key: "state",
      width: 20,
    },
    {
      header: "PIN Code",
      key: "pinCode",
      width: 15,
    },
    {
      header: "Club Name",
      key: "clubName",
      width: 25,
    },
    {
      header: "Representing State",
      key: "representingState",
      width: 20,
    },
    {
      header: "Competition",
      key: "competitionApplied",
      width: 30,
    },
    {
      header: "Status",
      key: "status",
      width: 15,
    },
  ];

  athletes.forEach((athlete) => {
    worksheet.addRow({
      id: athlete.id,

      firstName:
        athlete.personalDetails?.firstName || "",

      lastName:
        athlete.personalDetails?.lastName || "",

      dob:
        athlete.personalDetails?.dob || "",

      age:
        athlete.personalDetails?.age || "",

      ageGroup:
        athlete.personalDetails?.ageGroup || "",

      gender:
        athlete.personalDetails?.gender || "",

      mobile:
        athlete.personalDetails?.mobile || "",

      email:
        athlete.personalDetails?.email || "",

      guardianName:
        athlete.guardianDetails?.guardianName || "",

      guardianMobile:
        athlete.guardianDetails?.guardianMobile || "",

      guardianRelation:
        athlete.guardianDetails?.guardianRelation || "",

      address:
        athlete.address?.addressLine || "",

      city:
        athlete.address?.city || "",

      state:
        athlete.address?.state || "",

      pinCode:
        athlete.address?.pinCode || "",

      clubName:
        athlete.clubDetails?.clubName || "",

      representingState:
        athlete.clubDetails?.representingState || "",

      competitionApplied:
        athlete.competition?.competitionApplied || "",

      status:
        athlete.status || "Pending",
    });
  });

  worksheet.getRow(1).font = {
    bold: true,
  };

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  worksheet.autoFilter = {
    from: "A1",
    to: "T1",
  };

  return workbook;
};

module.exports = {
  createAthleteExcel,
};