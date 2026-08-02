const farmers = [
  { initials: 'RS', name: 'Ranjit Singh', loc: 'Khanna, Ludhiana', quote: '"My tomatoes leave the field at 5 AM. By your dinner, they\'ve travelled less than my scooter does daily."' },
  { initials: 'KD', name: 'Kavita Devi', loc: 'Hoshiarpur', quote: '"We\'ve kept the same two buffaloes for nine years. The milk you get is the milk my kids drink."' },
  { initials: 'GS', name: 'Gurpreet Sandhu', loc: 'Jagraon', quote: '"Grade A isn\'t a sticker for me — it\'s what I\'d feed my own family, nothing less."' },
  { initials: 'MK', name: 'Manpreet Kaur', loc: 'Raikot', quote: '"Every crate gets my thumbprint stamp before it leaves. If it\'s damaged, I want to know."' }
];

export default function Farmers() {
  return (
    <section className="section section-farmers">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Where it comes from</p>
          <h2>Straight from these hands</h2>
        </div>
        <div className="row g-4">
          {farmers.map(f => (
            <div className="col-md-6 col-lg-3" key={f.name}>
              <div className="farmer-card">
                <div className="farmer-avatar">{f.initials}</div>
                <h5>{f.name}</h5>
                <p className="farmer-loc"><i className="bi bi-geo-alt"></i> {f.loc}</p>
                <p className="farmer-quote">{f.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
