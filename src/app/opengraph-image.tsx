import { ImageResponse } from 'next/og';

export const alt = 'GitSaga — Your Code, As Legend';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 700,
                        height: 700,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(234,179,8,0.15) 0%, transparent 70%)',
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.03,
                        backgroundImage:
                            'linear-gradient(to right, #eab308 1px, transparent 1px), linear-gradient(to bottom, #eab308 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Title */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 8,
                        marginBottom: 24,
                    }}
                >
                    <span
                        style={{
                            fontSize: 96,
                            fontWeight: 800,
                            letterSpacing: '-0.05em',
                            color: '#ffffff',
                        }}
                    >
                        Git
                    </span>
                    <span
                        style={{
                            fontSize: 96,
                            fontWeight: 800,
                            letterSpacing: '-0.05em',
                            color: '#eab308',
                            fontStyle: 'italic',
                        }}
                    >
                        Saga
                    </span>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: 32,
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 500,
                        marginBottom: 16,
                        letterSpacing: '-0.02em',
                    }}
                >
                    Your commits. Your legend.
                </div>

                {/* Description */}
                <div
                    style={{
                        fontSize: 20,
                        color: 'rgba(255,255,255,0.4)',
                        maxWidth: 600,
                        textAlign: 'center',
                        lineHeight: 1.5,
                    }}
                >
                    Turn your GitHub commit history into an epic AI-narrated story
                </div>

                {/* Bottom accent bar */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(to right, transparent, #eab308, transparent)',
                    }}
                />
            </div>
        ),
        { ...size },
    );
}
