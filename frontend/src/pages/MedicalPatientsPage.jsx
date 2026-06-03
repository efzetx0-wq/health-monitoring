import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api
from "../api/axios";

import MedicalLayout
from "../layouts/MedicalLayout";

export default function MedicalPatientsPage() {

  const [patients, setPatients] =
    useState([]);

  const navigate =
    useNavigate();

  useEffect(() => {

    fetchPatients();

  }, []);

  const fetchPatients =
    async () => {

    try {

      const response =
        await api.get(
          "/medical/patients"
        );

      setPatients(
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

          Patients

        </h1>

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">

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
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >

                  <div>

                    <h2 className="
                      text-xl
                      font-bold
                    ">

                      {patient.name}

                    </h2>

                    <p className="mt-2">

                      Email:
                      {" "}
                      {patient.email}

                    </p>

                    <p>

                      Role:
                      {" "}
                      {patient.role}

                    </p>

                  </div>

                  <div className="mt-4 md:mt-0">

                    <button
                      onClick={() =>
                        navigate(
                          `/medical-patient/${patient.id}`
                        )
                      }
                      className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-4
                        py-2
                        rounded-lg
                      "
                    >

                      View Detail

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </MedicalLayout>
  )
}