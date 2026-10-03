import React from 'react';
import Image from 'next/image';
import Header from '../components/site/Header';
import PAMark from '../components/site/PAMark';
import Ribbon from '../components/site/Ribbon';
import Newsletter from '../components/site/Newsletter';
import VideoFacade from '../components/site/VideoFacade';
import VisitTracker from '../components/site/VisitTracker';
import { ArrowRight, ArrowUpRight } from '../components/site/Icons';
import { site, type Entry } from '../content/site';
import './site.css';

const EntryList: React.FC<{ entries: Entry[] }> = ({ entries }) => (
    <div className="chapter__list">
        {entries.map(entry => (
            <article key={entry.id}>
                <h3>{entry.title}</h3>
                {entry.meta && <p className="meta">{entry.meta}</p>}
                {entry.body.map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </article>
        ))}
    </div>
);

export default function Home() {
    const { hero, experience, research, building, leadership, education, beyond, contact } = site;

    return (
        <div className="site" id="top">
            <VisitTracker />
            <Header />

            <main className="site-shell">
                <div className="site-column">
                    <section className="chapter hero" aria-labelledby="hero-name">
                        <PAMark variant="hero" className="hero__mark" />
                        <div className="hero__body">
                            <div>
                                <h1 id="hero-name">{site.name}</h1>
                                <p className="hero__positioning">{hero.positioning}</p>
                                {hero.intro.map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                                <div className="hero__links">
                                    <a href="#contact" className="link-accent">
                                        Get in touch <ArrowRight />
                                    </a>
                                    <a href={contact.linkedin.href} className="link-accent" target="_blank" rel="noopener noreferrer">
                                        LinkedIn <ArrowUpRight />
                                    </a>
                                </div>
                            </div>
                            <Image
                                src={hero.portrait.src}
                                alt={hero.portrait.alt}
                                width={304}
                                height={380}
                                className="hero__portrait"
                                priority
                            />
                        </div>
                    </section>

                    <section className="chapter" id="experience" aria-labelledby="experience-title">
                        <h2 id="experience-title">Experience</h2>
                        <div className="chapter__list">
                            {experience.map(role => (
                                <article key={role.id}>
                                    <div className="chapter__item-head">
                                        <h3>{role.title}</h3>
                                        <span className="chapter__org">{role.org}</span>
                                    </div>
                                    <p className="meta">{[role.place, role.dates].filter(Boolean).join(', ')}</p>
                                    <ul className="points">
                                        {role.points.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="chapter" id="research" aria-labelledby="research-title">
                        <h2 id="research-title">Research</h2>
                        <EntryList entries={research.entries} />
                        <p className="lede" style={{ marginTop: '2.75rem' }}>{research.interests}</p>
                    </section>

                    <section className="chapter" id="building" aria-labelledby="building-title">
                        <h2 id="building-title">Building</h2>
                        <p className="lede">{building.body}</p>
                        <a href={building.link.href} className="link-accent" target="_blank" rel="noopener noreferrer">
                            {building.link.label} <ArrowUpRight />
                        </a>
                    </section>

                    <section className="chapter" id="leadership" aria-labelledby="leadership-title">
                        <h2 id="leadership-title">Leadership</h2>
                        <EntryList entries={leadership} />
                    </section>

                    <section className="chapter" id="education" aria-labelledby="education-title">
                        <h2 id="education-title">Education</h2>
                        <p className="education__degree">{education.degree}</p>
                        <p className="meta">{education.details}, {education.school}</p>
                    </section>

                    <section className="chapter" id="beyond" aria-labelledby="beyond-title">
                        <h2 id="beyond-title">Beyond work</h2>
                        <p>{beyond.interests}</p>
                        <p>
                            {beyond.writing.text}{' '}
                            <a href={beyond.writing.link.href} className="link-accent">
                                {beyond.writing.link.label} <ArrowRight />
                            </a>
                        </p>
                        {beyond.video.url && (
                            <>
                                <p>{beyond.video.text}</p>
                                <VideoFacade url={beyond.video.url} title={beyond.video.title} />
                            </>
                        )}
                        <p style={{ marginTop: beyond.video.url ? '1.5rem' : undefined }}>{beyond.watches}</p>
                    </section>

                    <section className="chapter" id="contact" aria-labelledby="contact-title">
                        <h2 id="contact-title">Contact</h2>
                        <p>{contact.text}</p>
                        <a href={`mailto:${contact.email}`} className="contact__email">{contact.email}</a>
                        <div className="contact__links">
                            <a href={contact.linkedin.href} className="link-accent" target="_blank" rel="noopener noreferrer">
                                {contact.linkedin.label} <ArrowUpRight />
                            </a>
                            {contact.cv && (
                                <a href={contact.cv.href} className="link-accent">
                                    {contact.cv.label} <ArrowRight />
                                </a>
                            )}
                        </div>
                        <Newsletter />
                    </section>
                </div>
            </main>

            <footer className="site-footer">
                <div className="site-shell">
                    <p>{site.footer}</p>
                </div>
            </footer>

            <Ribbon />
        </div>
    );
}
