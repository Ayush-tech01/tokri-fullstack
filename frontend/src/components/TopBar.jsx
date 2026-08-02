export default function TopBar() {
  return (
    <div className="topbar">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        <span className="topbar-item"><i className="bi bi-geo-alt-fill"></i> Delivering to <strong>Chandigarh, 160017</strong></span>
        <div className="d-none d-md-flex gap-4">
          <span className="topbar-item"><i className="bi bi-truck"></i> Order before 4 PM for same-day delivery</span>
          <span className="topbar-item"><i className="bi bi-telephone"></i> Help line: 1800-000-1234</span>
        </div>
      </div>
    </div>
  );
}
