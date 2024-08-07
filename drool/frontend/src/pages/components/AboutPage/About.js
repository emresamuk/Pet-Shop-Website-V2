import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/admin/team') 
      .then(response => response.json())
      .then(data => setTeamMembers(data))
      .catch(error => console.error('Error fetching team members:', error));
  }, []);

  return (
    <div className="about-stylish">
      <header className="about-stylish-header">
        <h1 className="about-stylish-title">Hakkımızda</h1>
        <p className="about-stylish-subtitle">Hayvan dostlarınız için kaliteli ve şefkatli hizmet sunuyoruz.</p>
      </header>

      <main className="about-stylish-main">
        <section className="about-stylish-section">
          <h2 className="about-stylish-heading">Neden Biz?</h2>
          <p className="about-stylish-text">Her petin özel olduğuna inanıyor ve onlara en iyi bakımı sağlamayı taahhüt ediyoruz.</p>
        </section>

        <section className="about-stylish-team">
          <h2 className="about-stylish-heading">Ekibimiz</h2>
          <div className="about-stylish-team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="about-stylish-team-card">
                <img src={member.image_url} alt={member.name} className="about-stylish-team-img"/>
                <h3 className="about-stylish-team-name">{member.name}</h3>
                <p className="about-stylish-team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
