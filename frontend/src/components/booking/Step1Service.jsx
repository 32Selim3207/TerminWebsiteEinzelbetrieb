import { SERVICES } from '../../constants/booking';

export default function Step1Service({ data, update }) {
  return (
    <div>
      <h3>Welche Leistung benötigen Sie?</h3>
      <p className="section-sub small" style={{ marginBottom: 20 }}>
        Wählen Sie eine Leistung. Sie können zusätzlich einen Hinweis
        zu Ihrem Problem hinterlassen.
      </p>

      <div className="service-pick-grid">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={
              'service-card' + (data.serviceType === s.id ? ' is-selected' : '')
            }
            onClick={() => update({ serviceType: s.id })}
          >
            <span className="service-icon">
              <svg><use href={`#${s.icon}`} /></svg>
            </span>
            <h3>{s.label}</h3>
            <p>{s.desc}</p>
            <span className="service-card-check">
              <svg><use href="#icon-check" /></svg> Ausgewählt
            </span>
          </button>
        ))}
      </div>

      <div className="field">
        <label htmlFor="problem-note">Beschreibung (optional)</label>
        <textarea
          id="problem-note"
          placeholder="Was ist das Problem? Wann tritt es auf?"
          value={data.problemNote}
          onChange={(e) => update({ problemNote: e.target.value })}
        />
      </div>
    </div>
  );
}