export interface TwuString {
  name: string;
  material: string;
  gauge?: string;
  settledTension?: number; // lbs — tensão real após acomodar, partindo de 51 lbs
  stiffness?: number; // lb/pol — menor = mais macia
  staticLoss?: number; // lbs perdidas na puxada
  stabilizationLoss?: number; // lbs perdidas nas primeiras 24 h
  impactLoss?: number; // lbs perdidas nos impactos
  tensionLoss?: number; // % do total
  energyReturn?: number; // % — maior = mais potência
  ballCOF?: number; // atrito corda/bola
  spin?: number; // potencial de spin
}

// Perfil da corda, de 1 a 5, comparado com todo o banco de dados
export interface StringProfile {
  spin: number;
  control: number;
  power: number;
  comfort: number;
  stability: number; // manutenção da tensão
}
