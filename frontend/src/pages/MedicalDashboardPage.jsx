import {
  useEffect,
  useState
} from "react";

import api
from "../api/axios";

import MedicalLayout
from "../layouts/MedicalLayout";

export default function MedicalDashboardPage() {

  const [patients, setPatients] =
    useState([]);

  const [reports, setReports] =
    useState([]);

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

    try {

      // PATIENTS
      const patientResponse =
        await api.get(
          "/medical/patients"
        );

      setPatients(
        patientResponse.data
      );

      // REPORTS
      const reportResponse =
        await api.get(
          "/health-reports"
        );

      setReports(
        reportResponse.data
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

          Medical Dashboard

        </h1>

        {/* STATS */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mb-8
        ">

          {/* TOTAL PATIENT */}
          <div className="
            bg-white
            rounded-2xl
            shadow
            p-6
          ">

            <h2 className="
              text-gray-500
            ">

              Total Patients

            </h2>

            <p className="
              text-4xl
              font-bold
              mt-4
            ">

              {patients.length}

            </p>

          </div>

          {/* TOTAL REPORTS */}
          <div className="
            bg-white
            rounded-2xl
            shadow
            p-6
          ">

            <h2 className="
              text-gray-500
            ">

              Health Reports

            </h2>

            <p className="
              text-4xl
              font-bold
              mt-4
            ">

              {reports.length}

            </p>

          </div>

        </div>

        {/* RECENT PATIENTS */}
        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">

            Recent Patients

          </h2>

          {patients.length === 0 ? (

            <p>

              No patients found

            </p>

          ) : (

            <div className="space-y-4">

              {patients.map(
                (patient) => (

                <div
                  key={patient.id}
                  className="
                    border
                    rounded-xl
                    p-4
                  "
                >

                  <h3 className="
                    text-lg
                    font-bold
                  ">

                    {patient.name}

                  </h3>

                  <p className="mt-2">

                    {patient.email}

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