import {
  useEffect,
  useState
} from "react";

import api
from "../api/axios";

import MedicalLayout
from "../layouts/MedicalLayout";

export default function MedicalReportsPage() {

  const [reports, setReports] =
    useState([]);

  useEffect(() => {

    fetchReports();

  }, []);

  const fetchReports =
    async () => {

    try {

      const response =
        await api.get(
          "/health-reports"
        );

      setReports(
        response.data
      );

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <MedicalLayout>

      <div className="p-6">

        <h1 className="
          text-3xl
          font-bold
          mb-8
        ">

          Health Reports

        </h1>

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">

          {reports.length === 0 ? (

            <p>

              No reports found

            </p>

          ) : (

            <div className="space-y-4">

              {reports.map(
                (report) => (

                <div
                  key={report.id}
                  className="
                    border
                    rounded-xl
                    p-4
                  "
                >

                  <h2 className="
                    text-xl
                    font-bold
                  ">

                    Report #{report.id}

                  </h2>

                  <p className="mt-2">

                    Average Sleep:
                    {" "}
                    {report.average_sleep}

                  </p>

                  <p>

                    Average Steps:
                    {" "}
                    {report.average_steps}

                  </p>

                  <p>

                    BMI Status:
                    {" "}
                    {report.bmi_status}

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </MedicalLayout>
  )
}