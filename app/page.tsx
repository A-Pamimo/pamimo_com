import React from 'react';
import Image from 'next/image';
import Header from '../components/site/Header';
import PAMark from '../components/site/PAMark';
import Ribbon from '../components/site/Ribbon';
import Newsletter from '../components/site/Newsletter';
import VideoFacade from '../components/site/VideoFacade';
import VisitTracker from '../components/site/VisitTracker';
import ClockPalette from '../components/site/ClockPalette';
import ChapterFigure from '../components/site/origami/ChapterFigure';
import { ArrowRight, ArrowUpRight } from '../components/site/Icons';
import { site, type Entry } from '../content/site';
import './site.css';

/** Acronyms set in small caps: RBC, AI, AKS, IaC and the like */
const ABBR = /\b([A-Z]{2,}s?|IaC)\b/;

/** Typesets copy: text between backticks becomes inline code, acronyms small caps */
const rich = (text: string) =>
    text.split('`').flatMap((part, i) =>
        i % 2
            ? [<code key={`c${i}`}>{part}</code>]
            : part.split(new RegExp(ABBR.source, 'g')).map((bit, j) =>
                  j % 2 ? (
                      <abbr key={`a${i}-${j}`} className="sc">
                          {bit}
                      </abbr>
                  ) : (
                      bit
                  ),
              ),
    );

const EntryList: React.FC<{ entries: Entry[] }> = ({ entries }) => (
    <div className="chapter__list">
        {entries.map(entry => (
            <article key={entry.id}>
                <h3>{entry.title}</h3>
                {entry.meta && <p className="meta">{entry.meta}</p>}
                {entry.body.map((para, i) => (
                    <p key={i}>{rich(para)}</p>
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
            <ClockPalette />
            <Header />

            <main className="site-shell">
                <div className="site-column">
                    <section className="chapter hero" aria-labelledby="hero-name">
                        <PAMark variant="hero" className="hero__mark" />
                        <h1 id="hero-name">{site.name}</h1>
                        <div className="hero__lead">
                            <p className="hero__dek">{hero.positioning}</p>
                            <Image
                                src={hero.portrait.src}
                                alt={hero.portrait.alt}
                                width={304}
                                height={380}
                                className="hero__portrait"
                                priority
                            />
                        </div>
                        {hero.intro.map((para, i) => (
                            <p key={i}>{rich(para)}</p>
                        ))}
                        <div className="hero__links">
                            <a href="#contact" className="link-accent">
                                Get in touch <ArrowRight />
                            </a>
                            <a href={contact.linkedin.href} className="link-accent" target="_blank" rel="noopener noreferrer">
                                LinkedIn <ArrowUpRight />
                            </a>
                        </div>
                    </section>

                    <section className="chapter" id="experience" aria-labelledby="experience-title">
                        <ChapterFigure shape="helm" />
                        <h2 id="experience-title">Experience</h2>
                        <div className="chapter__list">
                            {experience.map(role => (
                                <article key={role.id}>
                                    <div className="chapter__item-head">
                                        <h3>{role.title}</h3>
                                        <span className="chapter__org">{role.org}</span>
                                    </div>
                                    <p className="meta">{[role.place, role.dates].filter(Boolean).join(', ')}</p>
                                    {role.story ? (
                                        role.story.map((para, i) => (
                                            <p key={i}>{rich(para)}</p>
                                        ))
                                    ) : (
                                        <ul className="points">
                                            {role.points?.map((point, i) => (
                                                <li key={i}>{rich(point)}</li>
                                            ))}
                                        </ul>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="chapter" id="research" aria-labelledby="research-title">
                        <ChapterFigure shape="lantern" />
                        <h2 id="research-title">Research</h2>
                        <EntryList entries={research.entries} />
                        <p className="lede research__interests">{rich(research.interests)}</p>
                    </section>

                    <section className="chapter" id="building" aria-labelledby="building-title">
                        <ChapterFigure shape="boat" />
                        <h2 id="building-title">Building</h2>
                        <p className="lede">{rich(building.body)}</p>
                        <a href={building.link.href} className="link-accent" target="_blank" rel="noopener noreferrer">
                            {building.link.label} <ArrowUpRight />
                        </a>
                    </section>

                    <section className="chapter" id="leadership" aria-labelledby="leadership-title">
                        <ChapterFigure shape="pinwheel" />
                        <h2 id="leadership-title">Leadership</h2>
                        <EntryList entries={leadership} />
                    </section>

                    <section className="chapter" id="education" aria-labelledby="education-title">
                        <ChapterFigure shape="mortarboard" />
                        <h2 id="education-title">Education</h2>
                        <p className="education__degree">{education.degree}</p>
                        <p className="meta">{education.details}, {education.school}</p>
                    </section>

                    <section className="chapter" id="beyond" aria-labelledby="beyond-title">
                        <ChapterFigure shape="watch" />
                        <h2 id="beyond-title">Beyond work</h2>
                        <p>{rich(beyond.interests)}</p>
                        <p>
                            {beyond.writing.text}{' '}
                            <a href={beyond.writing.link.href} className="link-accent">
                                {beyond.writing.link.label} <ArrowRight />
                            </a>
                        </p>
                        <div className="photos" role="region" aria-label="Photos" tabIndex={0}>
                            {beyond.photos.map(photo => (
                                <figure key={photo.src} className="photos__item">
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt}
                                        width={photo.width}
                                        height={photo.height}
                                        loading="lazy"
                                        sizes="(max-width: 48rem) 70vw, 20rem"
                                        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                                    />
                                    <figcaption>{photo.caption}</figcaption>
                                </figure>
                            ))}
                        </div>
                        {beyond.video.url && (
                            <>
                                <p>{beyond.video.text}</p>
                                <VideoFacade url={beyond.video.url} title={beyond.video.title} />
                            </>
                        )}
                        <p className="beyond__after">{rich(beyond.watches)}</p>
                        <p>{rich(beyond.askMe)}</p>
                    </section>

                    <section className="chapter" id="contact" aria-labelledby="contact-title">
                        <ChapterFigure shape="envelope" />
                        <h2 id="contact-title">Contact</h2>
                        <p>{rich(contact.text)}</p>
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
