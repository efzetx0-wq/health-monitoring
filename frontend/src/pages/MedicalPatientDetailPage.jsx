import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import api
from "../api/axios";

import MedicalLayout
from "../layouts/MedicalLayout";

export default function MedicalPatientDetailPage() {

  const { id } =
    useParams();

  const [patient, setPatient] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchPatient();

  }, []);

  const fetchPatient =
    async () => {

    try {

      const response =
        await api.get(
          `/medical/patient/${id}`
        );

      setPatient(
        response.data
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  if (loading) {

    return (

      <MedicalLayout>

        <div className="p-6">

          Loading...

        </div>

      </MedicalLayout>
    );
  }

  if (!patient) {

    return (

      <MedicalLayout>

        <div className="p-6">

          Patient not found

        </div>

      </MedicalLayout>
    );
  }

  return (

    <MedicalLayout>

      <div className="p-6">

        <h1 className="
          text-3xl
          font-bold
          mb-8
        ">

          Patient Detail

        </h1>

        {/* BASIC INFO */}
        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-8
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-4
          ">

            {patient.name}

          </h2>

          <p>

            Email:
            {" "}
            {patient.email}

          </p>

          <p className="mt-2">

            Role:
            {" "}
            {patient.role}

          </p>

        </div>

        {/* HEALTH PROFILE */}
        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-8
        ">

          <h2 className="
            text-xl
            font-bold
            mb-4
          ">

            Health Profile

          </h2>

          {patient.health_profile ? (

            <div className="space-y-2">

              <p>

                Height:
                {" "}
                {patient.health_profile.height}
                {" "}cm

              </p>

              <p>

                Weight:
                {" "}
                {patient.health_profile.weight}
                {" "}kg

              </p>

              <p>

                BMI:
                {" "}
                {patient.health_profile.bmi}

              </p>

            </div>

          ) : (

            <p>

              No health profile

            </p>

          )}

        </div>

        {/* ACTIVITIES */}
        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-8
        ">

          <h2 className="
            text-xl
            font-bold
            mb-4
          ">

            Physical Activities

          </h2>

          {patient.physical_activities
            ?.length === 0 ? (

            <p>

              No activities

            </p>

          ) : (

            <div className="space-y-4">

              {patient.physical_activities.map(
                (activity) => (

                <div
                  key={activity.id}
                  className="
                    border
                    rounded-xl
                    p-4
                  "
                >

                  <p>

                    Steps:
                    {" "}
                    {activity.steps}

                  </p>

                  <p>

                    Calories:
                    {" "}
                    {activity.calories_burned}

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* HEALTH REPORTS */}
        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">

          <h2 className="
            text-xl
            font-bold
            mb-4
          ">

            Health Reports

          </h2>

          {patient.health_reports
            ?.length === 0 ? (

            <p>

              No reports

            </p>

          ) : (

            <div className="space-y-4">

              {patient.health_reports.map(
                (report) => (

                <div
                  key={report.id}
                  className="
                    border
                    rounded-xl
                    p-4
                  "
                >

                  <p>

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