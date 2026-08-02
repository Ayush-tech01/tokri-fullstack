const notes = [
  { stars: '★★★★★', text: '"Ordered at 2, veggies were on my kitchen counter by 6. Onions still had mud on them — I\'ll take that as a compliment."', sign: '— Simran, Model Town', tilt: false },
  { stars: '★★★★★', text: '"Returned a bruised papaya, no questions, refund same evening. Haven\'t gone back to the sabzi mandi since."', sign: '— Arjun, Sarabha Nagar', tilt: true },
  { stars: '★★★★☆', text: '"The combo boxes save real money, not the fake \'save 2%\' kind. Wish delivery slots opened earlier on Sundays."', sign: '— Harpreet, Civil Lines', tilt: false }
];

export default function Testimonials() {
  return (
    <section className="section section-notes">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Left on the doorstep</p>
          <h2>What people scribble back</h2>
        </div>
        <div className="row g-4">
          {notes.map(n => (
            <div className="col-md-4" key={n.sign}>
              <div className={`note-card ${n.tilt ? 'note-tilt' : ''}`}>
                <p className="note-stars">{n.stars}</p>
                <p className="note-text">{n.text}</p>
                <p className="note-sign">{n.sign}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
