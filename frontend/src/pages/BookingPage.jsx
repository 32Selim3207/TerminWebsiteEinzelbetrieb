import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { WERKSTATT_ID } from '../services/api';
import {
  emptyBooking, validators, STEP_LABELS, getServiceById, formatDateLong,
} from '../constants/booking';

import Step1Service from '../components/booking/Step1Service';
import Step2Vehicle from '../components/booking/Step2Vehicle';
import Step3DateTime from '../components/booking/Step3DateTime';
import Step4Contact from '../components/booking/Step4Contact';
import Step5Summary from '../components/booking/Step5Summary';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [data, setData] = useState(emptyBooking);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  // HomePage'den servis ön seçimiyle geldiyse Step 1'i doldur
  useEffect(() => {
    const preselected = location.state?.preselectedService;
    if (preselected) {
      setData((prev) => ({ ...prev, serviceType: preselected }));
    }
  }, [location.state]);

  const update = (patch) => {
    setData((prev) => ({ ...prev, ...patch }));
    setError(null);
  };

  const handleNext = async () => {
    const validate = validators[step];
    const err = validate(data);
    if (err) { setError(err); return; }

    if (step < 5) {
      setStep(step + 1);
      return;
    }

    // Step 5 → Backend'e gönder
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        werkstattId: WERKSTATT_ID,
        serviceType: data.serviceType,
        problemNote: data.problemNote,
        vehicleBrand: data.brand === 'Andere' ? data.brandOther : data.brand,
        vehicleModel: data.model,
        vehicleYear: data.year,
        licensePlate: data.plate,
        date: data.date,
        startTime: data.startTime,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
      };
      const { data: appt } = await api.post('/appointments', payload);
      setCreatedAppointment(appt);
    } catch (err) {
      setError(err.response?.data?.error || 'Fehler beim Buchen. Bitte versuchen Sie es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const isSuccess = !!createdAppointment;

  // ---------- BAŞARILI RANDEVU: Ticket görünümü ----------
  if (isSuccess) {
    return (
      <section className="view active">
        <div className="container narrow" style={{ paddingTop: 36, paddingBottom: 60 }}>
          <ConfirmationTicket appointment={createdAppointment} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Zur Startseite
            </button>
            <button className="btn btn-dark" onClick={() => navigate('/manage')}>
              Termin verwalten
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ---------- Sihirbaz ----------
  return (
    <section className="view active">
      <div className="container narrow" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <p className="eyebrow eyebrow-dark">TERMIN BUCHEN</p>

        <div>
          {/* Step indicator */}
          <ol className="step-indicator">
            {STEP_LABELS.map((s) => (
              <li
                key={s.num}
                className={
                  'step' +
                  (step === s.num ? ' is-active' : '') +
                  (step > s.num ? ' is-done' : '')
                }
              >
                <span className="step-num">{step > s.num ? '✓' : s.num}</span>
                <span className="step-label">{s.label}</span>
              </li>
            ))}
          </ol>

          {/* Step body */}
          <div className="wizard-body">
            {step === 1 && <Step1Service data={data} update={update} />}
            {step === 2 && <Step2Vehicle data={data} update={update} />}
            {step === 3 && <Step3DateTime data={data} update={update} />}
            {step === 4 && <Step4Contact data={data} update={update} />}
            {step === 5 && <Step5Summary data={data} />}

            {error && (
              <div className="field-error" style={{ marginTop: 18 }}>{error}</div>
            )}
          </div>

          {/* Navigation */}
          <div className="wizard-nav">
            <button
              className="btn btn-outline"
              onClick={handleBack}
              disabled={step === 1 || submitting}
              style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
            >
              <svg className="icon"><use href="#icon-chevron-left" /></svg> Zurück
            </button>
            <button
              className="btn btn-accent"
              onClick={handleNext}
              disabled={submitting}
            >
              {step === 5 ? (
                submitting ? 'Wird gebucht...' : (
                  <>
                    <svg className="icon"><use href="#icon-check" /></svg> Termin buchen
                  </>
                )
              ) : (
                <>Weiter <svg className="icon"><use href="#icon-chevron-right" /></svg></>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Confirmation Ticket ----------
function ConfirmationTicket({ appointment }) {
  const service = getServiceById(appointment.serviceType);
  return (
    <div className="ticket-wrap">
      <div className="ticket">
        <div className="ticket-stamp">BESTÄTIGT</div>
        <div className="ticket-top">
          <p className="eyebrow">TERMIN GEBUCHT</p>
          <h3>Vielen Dank, {appointment.customerName.split(' ')[0]}!</h3>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 14.5, margin: 0 }}>
            Eine Bestätigung wurde an {appointment.customerEmail} gesendet.
          </p>
        </div>
        <div className="ticket-divider" />
        <div className="ticket-bottom">
          <div className="ticket-code-label">Ihr Termincode</div>
          <div className="ticket-code">{appointment.appointmentCode}</div>
          <div className="ticket-details">
            <div><b>{service?.label}</b></div>
            <div>{formatDateLong(appointment.date)}</div>
            <div>{appointment.startTime} – {appointment.endTime} Uhr</div>
            <div>{appointment.vehicleBrand} {appointment.vehicleModel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}