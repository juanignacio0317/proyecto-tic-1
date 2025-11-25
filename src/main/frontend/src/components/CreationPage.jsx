import React from "react";
import { useNavigate } from "react-router-dom";

export default function EligeTuCreacionPage() {
    const navigate = useNavigate();

    const go = (type) => {
        navigate(type === "burger" ? "/personaliza" : "/personalizapizza");
    };

    return (
        <main
            style={{
                height: "100vh",
                background: "#1B7F79",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.5rem",
            }}
        >
            {/* PANEL BLANCO */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1250px",
                    height: "80vh",
                    background: "#FFFFFF",
                    borderRadius: "1rem",
                    padding: "2.5rem 3rem",
                    boxShadow: "0 22px 50px rgba(0,0,0,0.22)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                {/* TITULO */}
                <div className="text-center">
                    <p
                        style={{
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            color: "#1B7F79",
                            fontSize: "0.85rem",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                        }}
                    >
                        PizzUM & BurgUM
                    </p>

                    <h1
                        style={{
                            color: "#12332F",
                            marginBottom: "0.4rem",
                            fontWeight: "700",
                            fontSize: "2.1rem",
                        }}
                    >
                        ¿Qué querés crear hoy?
                    </h1>

                    <p style={{ color: "#4B635F", fontSize: "1.05rem" }}>
                        Elegí si querés una hamburguesa o una pizza
                    </p>
                </div>

                {/* CARDS */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        gap: "2rem",
                        alignItems: "center",
                    }}
                >
                    {/* CARD BURGER */}
                    <div
                        style={{
                            flex: 1,
                            background: "#FFFFFF",
                            borderRadius: "1.2rem",
                            padding: "2rem 2rem",
                            textAlign: "center",
                            cursor: "pointer",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "all 0.2s ease",
                        }}
                        onClick={() => go("burger")}
                    >
                        <div style={{ fontSize: "4rem" }}>🍔</div>

                        <div>
                            <h3 style={{ fontSize: "1.45rem", color: "#12332F", fontWeight: "700" }}>
                                Crear una <span style={{ color: "#26A541" }}>burger</span>
                            </h3>

                            <p
                                style={{
                                    color: "#4B635F",
                                    fontSize: "1rem",
                                    maxWidth: "330px",
                                    margin: "0 auto",
                                }}
                            >
                                Elegí pan, carne, queso y toppings para tu obra maestra.
                            </p>
                        </div>

                        {/* BOTÓN */}
                        <button
                            style={{
                                background: "#26A541",
                                color: "white",
                                border: "none",
                                padding: "0.75rem 1.8rem",
                                borderRadius: "10px",
                                fontWeight: "600",
                                fontSize: "1rem",
                                width: "fit-content",
                                whiteSpace: "nowrap",
                                transition: "all 0.25s ease",
                                boxShadow: "0 10px 16px rgba(38,165,65,0.3)",
                                marginTop: "1.5rem",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 14px 22px rgba(38,165,65,0.38)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 10px 16px rgba(38,165,65,0.3)";
                            }}
                        >
                            Ir a las hamburguesas →
                        </button>
                    </div>

                    {/* CARD PIZZA */}
                    <div
                        style={{
                            flex: 1,
                            background: "#FFFFFF",
                            borderRadius: "1.2rem",
                            padding: "2rem 2rem",
                            textAlign: "center",
                            cursor: "pointer",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.08)", // 🔥 hover removido
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "all 0.2s ease",
                        }}
                        onClick={() => go("pizza")}
                    >
                        <div style={{ fontSize: "4rem" }}>🍕</div>

                        <div>
                            <h3 style={{ fontSize: "1.45rem", color: "#12332F", fontWeight: "700" }}>
                                Crear una <span style={{ color: "#F97373" }}>pizza</span>
                            </h3>

                            <p
                                style={{
                                    color: "#4B635F",
                                    fontSize: "1rem",
                                    maxWidth: "330px",
                                    margin: "0 auto",
                                }}
                            >
                                Masa, salsa, queso y todos los toppings que quieras.
                            </p>
                        </div>

                        {/* BOTÓN */}
                        <button
                            style={{
                                background: "#F97373",
                                color: "white",
                                border: "none",
                                padding: "0.75rem 1.8rem",
                                borderRadius: "10px",
                                fontWeight: "600",
                                fontSize: "1rem",
                                width: "fit-content",
                                whiteSpace: "nowrap",
                                transition: "all 0.25s ease",
                                boxShadow: "0 10px 16px rgba(249,115,129,0.3)",
                                marginTop: "1.5rem",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 14px 22px rgba(249,115,129,0.38)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 10px 16px rgba(249,115,129,0.3)";
                            }}
                        >
                            Ir a las pizzas →
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
