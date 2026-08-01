// Banco de cordas — dados reais extraídos da TWU String Performance Database
// (twu.tennis-warehouse.com/learning_center/reporter2.php) em 01/08/2026.
// RAW_A: todas as cordas na condição de referência (51 lbs, swing médio) —
//   campos: nome|material|calibre|rigidez(lb/pol)|perda de tensão(%)|retorno de energia(%)|potencial de spin
// RAW_B: poliésteres em condição complementar (8 campos, inclui COF) — usados
//   apenas para modelos que não aparecem em RAW_A.

export interface TwuString {
  name: string;
  material: string;
  gauge?: string;
  stiffness?: number; // lb/pol — menor = mais macia/confortável
  tensionLoss?: number; // % — menor = mais estável
  energyReturn?: number; // % — maior = mais potência
  spin?: number; // potencial de spin — maior = mais spin
}

const RAW_A = `Tecnifibre Black Code 4S 17 (1.25)|Polyester|1.25|230.9|27.6|93.1|9.8
Diadem Solstice Power 17 (1.20)|Polyester|1.2|220.0|28|93.7|8.6
Volkl Cyclone 19 (1.10)|Polyester|1.1|192.0|32.5|92.2|8.2
Diadem Solstice Power 16 (1.30)|Polyester|1.3|224.6|28.7|90.4|8.1
Double AR Diablo (1.31)|Polyester|1.31|182.9|54.8|86.1|7.7
Wilson Revolve 17 (1.25)|Polyester|1.25|204.6|35.5|92.5|7.7
Kirschbaum Spiky Shark 16|Polyester|1.3|240.6|46.6|89.5|7.5
Kirschbaum Spiky Shark 17|Polyester|1.25|218.3|53|87.6|7.4
Double AR Diablo (1.24)|Polyester|1.24|181.2|54.4|87.0|7.4
Double AR WTS 25 (1.25)|Polyester|1.25|181.2|55.5|86.3|7.3
Diadem Solstice Pro 16L (1.25)|Polyester||194.3|30.8|89.1|7.3
Double AR Twice Dragon(1.30)|Polyester|1.3|192.0|50.5|89.9|7.2
Volkl Cyclone 18|Polyester|1.2|201.2|47.8|88.7|7.1
Head Lynx 16 (1.30)|Polyester|1.3|210.9|45|90.2|7
Solinco Hyper-G 16|Polyester|1.30|242.3|25.6|93.1|7
IsoSpeed Pyramid 16|Polyester|1.3|193.2|57.2|86.9|7
Volkl V-Star 16 (1.30)|Polyester|1.3|185.7|54.1|87.2|6.9
Luxilon Alu Power Soft 1.25|Polyester|1.25|208.6|36|92.2|6.9
Solinco Tour Bite 16 Soft|Polyester|1.3|207.5|49.8|90.4|6.9
Luxilon LXN Smart 16L (1.25)|Polyester|1.25|214.3|42.4|90.4|6.8
Luxilon 4G Soft 1.25|Polyester|1.25|238.9|24.9|93.7|6.7
Solinco Tour Bite 16|Polyester|1.3|232.0|46.5|89.7|6.7
L-Tec Premium 4S 16L (1.25)|Polyester|1.25|248.6|34.7|92.4|6.7
Solinco Revolution 17|Polyester|1.2|209.2|49.7|88.2|6.6
Luxilon Element 1.30|Polyester|1.3|211.5|43.7|90.1|6.6
MSV Focus Hex 17L (1.18)|Polyester|1.18|235.5|26.9|92.7|6.5
Babolat Origin 17|Nylon|1.25|187.5|16.7|97.4|6.4
Prince Tour XT 18|Polyester|1.18|198.3|37.8|92.5|6.4
Solinco Revolution 16|Polyester|1.3|247.5|46.9|89.1|6.4
Solinco Tour Bite 17|Polyester|1.2|200.0|48|88.2|6.3
Tourna Big Hitter Black 7 17|Polyester|1.23|196.0|42.3|90.2|6.3
MSV Focus Hex Soft 17 (1.25)|Polyester|1.25|252.0|28.8|95.5|6.3
Y-Tex Quadro Twist 16L|Polyester|1.26|205.2|47.6|90.6|6.2
Volkl Cyclone 16|Polyester|1.3|214.3|47.3|89.1|6.2
Gamma Zo Tour Rough 16|Polyester|1.28|202.3|48.2|90.1|6.1
Volkl Cyclone Tour 17 (1.25)|Polyester|1.25|199.5|52.3|88.7|6.1
Gamma Zo Verve 17|Polyester|1.25|252.0|24.8|94.3|6.1
Solinco Outlast 16|Polyester|1.3|236.0|46.9|89.1|6
Prince Tour XC 17L|Polyester|1.22|224.6|34.9|91.4|5.9
Signum Pro Plasma HEXtreme 16L/1.25|Polyester|1.25|228.6|41|89.3|5.9
Solinco Tour Bite 16L (1.25)|Polyester|1.25|259.5|24.7|92.5|5.9
Solinco Tour Bite 18 (1.15)|Polyester|1.15|187.5|50.2|89.3|5.8
Kirschbaum Black Shark 17 (1.25)|Polyester|1.25|238.3|37.9|91.6|5.8
Gamma Moto 16|Polyester|1.29|252.6|30|95.6|5.8
Topspin Cyber Blue 16|Polyester|1.3|213.7|42.8|90.2|5.8
Volkl Cyclone 17|Polyester|1.25|208.6|47.6|89.7|5.8
Double AR 666 (1.30)|Nylon|1.3|162.9|23.6|95.8|5.8
Luxilon ALU Power 125/16L|Polyester|1.25|225.2|46.1|89.5|5.8
Kirschbaum Pro Line II 1.30|Polyester|1.3|222.9|47.1|88.9|5.7
Kirschbaum Super Smash 17 (1.25)|Polyester|1.25|234.3|47.5|88.4|5.7
MSV Hepta-Twist 17|Polyester|1.25|202.3|49.6|89.1|5.7
Double AR Twice Shark (1.25)|Polyester||156.0|63.2|84.1|5.7
Tourna Black Zone 16|Polyester|1.3|226.3|28.8|92.5|5.6
IsoSpeed Black Fire 17|Polyester|1.25|238.3|38.7|90.6|5.6
Volkl V-Torque 16|Polyester|1.28|190.3|48.9|91.2|5.6
Signum Pro Poly-Plasma Pure 16L|Polyester|1.28|256.6|40.2|91.2|5.6
Prince Tour XS 16|Polyester|1.25|211.5|35.6|92.0|5.5
Prince Tour XP 16|Polyester|1.3|220.0|34.2|93.1|5.5
Prince Tour XC 16L|Polyester|1.22|224.0|34.7|91.6|5.5
Prince Tour XC 15L|Polyester|1.35|222.3|43.2|89.7|5.5
Gosen Polylon Comfort 16|Polyester|1.3|216.6|53.5|88.2|5.5
Solinco Outlast 17|Polyester|1.2|205.2|49.8|90.8|5.5
Tourna Big Hitter Silver 17|Polyester|1.25|201.2|44|89.9|5.4
Kirschbaum Helix 16|Polyester|1.3|226.3|54.4|88.0|5.4
Gosen A.K. Control 16|Nylon|1.3|172.6|21.9|95.6|5.4
Kirschbaum Black Shark 16 (1.30)|Polyester|1.3|255.5|40.7|95.3|5.4
Dunlop Black Widow 17|Polyester|1.26|230.3|30.9|89.7|5.4
Gamma Poly Z 16|Polyester|1.3|213.2|51.3|88.2|5.4
Prince Premier Control 16|Nylon|1.3|160.0|17|95.6|5.4
Luxilon ALU Power Feel 18/1.20|Polyester|1.2|200.6|40.9|91.2|5.4
Kirschbaum Touch Turbo 16L (1.275)|Polyester|1.275|222.3|47.7|87.6|5.4
Kirschbaum Max Power 17 (1.25)|Polyester|1.25|250.9|22.5|93.5|5.4
Solinco Tour Bite Diamond Rough 16L (1.25)|Polyester|1.25|218.9|46.3|92.4|5.4
RS RS Lyon 17|Polyester|1.25|213.2|35.4|92.5|5.4
Kirschbaum Helix 17|Polyester|1.25|231.5|43.5|90.2|5.4
Kirschbaum Touch Turbo 1.30|Polyester|1.3|261.7|45|89.1|5.3
Kirschbaum Super Smash 16/1.30|Polyester|1.3|240.6|50.3|87.4|5.3
Poly Star Turbo 16 (1.30)|Polyester|1.3|184.6|66.3|83.2|5.3
Double AR Raptor 1.27|Polyester|1.27|252.6|21.9|93.1|5.3
Prince Topspin Plus 16|Nylon|1.3|177.2|20|95.3|5.3
Wilson Enduro Tour 16|Polyester|1.3|276.0|37.1|90.1|5.2
Babolat Pro Hurricane Tour 17|Polyester|1.25|249.2|44.4|88.0|5.2
Kirschbaum P2 16/1.30|Polyester|1.3|253.2|37.7|90.6|5.2
Dunlop Black Widow 16|Polyester|1.31|220.0|37.7|91.2|5.2
Wilson Ripspin 16|Polyester|1.3|236.6|38.8|91.6|5.2
Wilson Ripspin 17|Polyester|1.25|229.2|37.3|91.6|5.2
Prince Tour XP 15L|Polyester|1.35|204.0|41.7|92.7|5.2
Signum Pro Poly-Plasma Pure 17 (1.23)|Polyester|1.23|225.2|42.4|89.9|5.2
Polyfibre Hexablade 17L (1.18)|Polyester|1.18|180.0|63.1|84.6|5.2
Volkl Synthetic Gut 17|Nylon|1.25|170.9|21.6|95.1|5.2
Kirschbaum Touch Turbo 17 (1.25)|Polyester|1.25|236.0|45|88.9|5.2
Kirschbaum Super Smash Spiky 17 (1.25)|Polyester|1.25|242.3|50.7|88.4|5.2
Volkl V-Pro 17|Polyester|1.23|206.9|47.3|90.1|5.1
Volkl Synthetic Gut 16|Nylon|1.3|177.7|19.7|93.3|5.1
Boris Becker Bomber 16|Polyester|1.28|225.2|46.9|90.1|5.1
Signum Pro Tornado 16|Polyester|1.29|242.3|47.4|90.4|5.1
Babolat Pro Hurricane Tour 16|Polyester|1.3|256.6|45.5|90.1|5.1
Poly Star Strike 16 (1.30)|Polyester|1.3|223.5|48.6|88.4|5.1
Gosen Polymaster II 16|Polyester|1.0|199.5|52.4|88.4|5.1
Kirschbaum Pro Line X 16 (1.30)|Polyester|1.3|276.6|26.6|93.1|5.1
Kirschbaum Super Smash Spiky 1.20|Polyester|1.2|218.9|52|89.3|5.1
Topspin Cyber Blue 17|Polyester|1.25|198.3|45.6|90.1|5.1
One Strings Carbon NRG 16|Polyester|1.3|204.0|41.7|91.8|5.1
Head Reflex MLT 16 (1.30)|Nylon|1.3|168.6|22.5|95.6|5.1
Volkl V-Pro 16|Polyester|1.28|258.3|38.8|89.9|5
Prince Premier Power 18|Nylon|1.2|142.9|19.9|95.8|5
Prince Tour XS 1.35|Polyester|1.35|215.5|35.2|93.5|5
Kirschbaum Super Smash Spiky 16/1.30|Polyester|1.3|237.2|54.1|86.7|5
Pacific ATP Poly Power Pro 16L|Polyester|1.25|219.5|50.5|86.9|5
Pacific Poly Force Xtreme 16L|Polyester|1.25|237.7|39|88.7|5
Tecnifibre Pro Red Code 18|Polyester|1.2|240.6|35.9|90.1|5
SuperString Viper V2 Rough 16L|Polyester|1.25|221.7|38|92.2|5
Signum Pro Poly-Plasma 17L (1.18)|Polyester|1.18|222.9|39.8|90.1|5
Poly Star Turbo 16L (1.25)|Polyester|1.25|184.6|65|85.0|5
Solinco Barb Wire 17 (1.20)|Polyester|1.2|206.3|42.3|90.4|4.9
Kirschbaum Competition 16/1.30|Polyester|1.3|227.5|46.9|94.3|4.9
Volkl V-Pro 18|Polyester|1.18|236.0|32.7|93.3|4.9
Kirschbaum P2 17 (1.25)|Polyester|1.25|254.3|33.4|93.1|4.9
Tourna Big Hitter Blue 17|Polyester|1.25|249.7|35.6|90.8|4.9
Solinco Tour Bite Diamond Rough 16 (1.30)|Polyester|1.3|209.7|51.5|88.5|4.9
Wilson Ripspin 15|Polyester|1.35|238.9|41.1|91.0|4.9
MSV Focus Evo 16|Polyester|1.3|256.0|43.8|90.4|4.9
Tecnifibre Pro Red Code 16|Polyester|1.3|261.7|34.3|88.0|4.9
Head Sonic Pro Edge 16|Polyester|1.3|233.7|37.8|91.6|4.8
Signum Pro Firestorm 1.25|Polyester|1.25|230.3|45.7|92.5|4.8
Topspin Cyber Flash 16|Polyester|1.3|199.5|46.1|89.5|4.8
Dunlop Explosive 16|Polyester|1.3|248.0|35.3|90.2|4.8
Kirschbaum Pro Line II 17L (1.20)|Polyester|1.2|212.6|45.6|90.4|4.8
Kirschbaum P2 17L (1.20)|Polyester|1.2|220.6|41.1|90.2|4.8
Poly Star Strike 16L (1.25)|Polyester|1.25|205.7|50.9|88.7|4.8
Gosen Polylon PolyBreak 18 (1.20)|Polyester|1.2|186.9|53.1|89.3|4.8
Kirschbaum Pro Line X 17 (1.25)|Polyester|1.25|245.2|36.4|93.1|4.8
Luxilon Big Banger Original 130/16|Polyester|1.3|233.7|51|91.0|4.8
Yonex Poly Tour Spin G 1.25|Polyester|1.25|252.0|24.5|92.7|4.8
Weiss Cannon Turbotwist 17L (1.18)|Polyester|1.18|221.2|47.8|89.5|4.8
Signum Pro Poly Megaforce 17 (1.19)|Polyester|1.19|241.2|36.4|92.2|4.8
Signum Pro Tornado 17 (1.23)|Polyester|1.23|235.5|43.9|91.0|4.8
Tecnifibre Pro Red Code 17|Polyester|1.25|245.7|36|90.8|4.8
Mantis Comfort Poly 16|Polyester|1.3|261.2|39.7|91.2|4.8
Mantis Power Poly 17|Polyester|1.25|241.2|42.6|90.8|4.8
Wilson Enduro Tour 17|Polyester|1.25|186.3|62.3|85.7|4.8
Wilson Enduro Pro 16|Polyester|1.3|252.0|35.8|90.6|4.7
Klip Hardcore 16/1.30|Polyester|1.3|219.5|49.2|86.5|4.7
Pacific X Force 18|Polyester|1.19|233.2|36.5|90.8|4.7
Babolat Hurricane Feel 16|Polyester|1.3|272.6|30.3|92.2|4.7
Kirschbaum Pro Line II 17 (1.25)|Polyester|1.25|225.7|44.3|90.2|4.7
Weiss Cannon Black 5 Edge 17 (1.24)|Polyester|1.24|238.9|32.2|92.2|4.7
Prince Premier Control 17|Nylon|1.25|156.6|18.7|95.5|4.7
Gosen Polymaster I 16|Polyester|1.02|206.9|51.2|90.6|4.7
IsoSpeed Pulse 16|Polyester|1.3|184.0|56.5|86.5|4.7
Gamma Zo Twist 16|Polyester|1.28|203.5|45.7|89.5|4.7
Signum Pro Poly-Plasma 16L|Polyester|1.28|256.0|38.7|91.2|4.7
Babolat Ballistic Polymono 16|Polyester|1.3|250.9|45.8|88.0|4.7
Head Hawk 17 (1.25)|Polyester|1.25|239.5|32.5|91.8|4.7
Polyfibre Hexablade 16L (1.25)|Polyester|1.25|193.7|62.5|85.9|4.6
Gosen Polylon SP 17 (1.24)|Polyester|1.24|199.5|51.7|91.0|4.6
Babolat RPM Blast 17/1.25|Polyester|1.25|257.2|32.6|92.2|4.6
Gosen Sidewinder 17|Polyester|1.23|179.5|46|91.0|4.6
Babolat RPM Dual 16|Polyester|1.3|265.2|34.2|94.9|4.6
Prince Premier Power 16|Nylon|1.3|149.7|19.9|95.6|4.6
Prince Premier Control 15|Nylon|1.4|157.2|18|96.8|4.6
Prince Premier Control 15L|Nylon|1.35|154.3|17.4|96.0|4.6
Topspin Cyber Flash 17L|Polyester|1.2|158.3|58.6|87.2|4.6
Gosen TecGut Remplir 16|Nylon/Polyurethane|1.29|154.3|30.2|93.1|4.6
Ashaway Liberty 16|Nylon|1.3|169.7|24|95.5|4.6
Head FXP Power 16|Nylon|1.3|164.6|24.6|96.0|4.6
Ashaway Synthetic Gut 16|Nylon|1.3|173.2|23.7|95.1|4.6
Luxilon Monotec Zolo 15L|Polyester|1.35|245.2|46.7|90.2|4.6
Kirschbaum Long Life 15|Polyester|1.38|259.5|55.1|88.7|4.6
Signum Pro Hyperion 16|Polyester|1.3|251.5|40.2|90.8|4.6
Tecnifibre Black Code 18|Polyester|1.18|228.0|40.4|90.4|4.6
Gosen Nanosilver 17|Nylon|1.25|165.7|21|95.8|4.5
Dunlop Comfort Poly 17|Polyester|1.25|262.9|41.5|89.1|4.5
Babolat RPM Blast 16|Polyester|1.3|267.5|45.2|89.7|4.5
Wilson NXT Duramax 15 (1.40)|Nylon|1.4|175.5|15.8|95.8|4.5
Pacific Poly Force 16L|Polyester|1.29|233.7|45.2|78.0|4.5
Pacific X Force 17|Polyester|1.24|255.5|35.7|91.8|4.5
Pacific Poly Force 17|Polyester|1.24|262.3|36.2|89.7|4.5
MSV Focus Evo 17|Polyester|1.25|232.0|45.6|89.7|4.5
Tourna Big Hitter Silver Rough 16|Polyester|1.3|229.7|44.3|91.2|4.5
Alien Black Diamond 16|Polyester|1.3|207.5|50.5|88.5|4.5
Head Ultra Tour 16|Polyester|1.27|215.5|44.4|90.4|4.5
Gosen Compositemaster II 16|Nylon|1.28|152.6|22.8|94.3|4.5
Head FXP Power 17|Nylon|1.24|164.0|21.5|93.9|4.5
Kirschbaum Pro Line II 18 (1.15)|Polyester|1.15|198.3|45.9|91.0|4.5
Kirschbaum Competition 17 (1.25)|Polyester|1.25|233.2|47|90.2|4.5
Gamma TNT2 Rx 16|Nylon|1.34|179.5|22.8|94.7|4.5
Prince Poly EXP 17|Polyester|1.25|235.5|43.3|88.9|4.4
Pacific Prime Natural Gut 16|Gut|1.34|88.6|12.3|97.0|4.4
Gosen AK Pro 17|Nylon|1.22|174.3|20.1|94.7|4.4
Polyfibre Poly Hightec 16L|Polyester|1.25|182.3|60.9|84.6|4.4
Polyfibre Hightec Premium 16L|Polyester|1.25|194.3|59.6|85.9|4.4
Prince Premier Touch 15L|Nylon|1.35|161.2|22.3|95.3|4.4
Wilson K-Gut 16|Nylon|1.32|186.3|19.3|96.8|4.4
Polyfibre TCS 16/1.30|Polyester|1.3|188.6|59.3|84.8|4.4
Kirschbaum Pro Line I 1.30|Polyester|1.3|253.7|47.2|88.0|4.4
Luxilon Big Banger Rough 130/16|Polyester|1.3|236.0|51.1|89.5|4.4
Kirschbaum Pro Line I 18L (1.15)|Polyester|1.15|211.5|50.1|87.2|4.4
Solinco Barb Wire 16|Polyester|1.3|244.6|39.3|90.8|4.4
Babolat Hurricane Feel 17|Polyester|1.25|252.6|31.2|91.6|4.4
Poly Star Classic 16L (1.25)|Polyester|1.25|205.7|54.5|86.7|4.4
Ashaway MonoGut ZX 16|Nylon/Zyex|1.27|114.3|47|93.1|4.4
Volkl Gripper 17|Nylon|1.25|146.9|24|94.5|4.4
Luxilon Big Banger TiMO 17L (1.17)|Polyester|1.17|216.0|45.5|89.1|4.4
Polyfibre TCS Rapid 16L/1.25|Polyester|1.25|176.0|64.2|85.6|4.3
Signum Pro Poly Megaforce 16|Polyester|1.29|261.7|34.6|89.3|4.3
Signum Pro Poly Speed Spin 1.28|Polyester|1.28|277.7|40|88.0|4.3
Luxilon Big Banger ALU Power Spin 127/16|Polyester|1.27|225.7|44.6|90.1|4.3
Tecnifibre HDX Tour 16 (1.30)|Nylon/Polyester||154.3|11.2|95.6|4.3
Solinco Tour Bite Diamond Rough 17 (1.20)|Polyester|1.2|203.5|42.8|91.0|4.3
Dunlop M-Fil Tour 16|Nylon|1.3|165.7|22.7|95.5|4.3
Babolat Conquest 16|Nylon|1.3|176.0|29.5|93.7|4.3
Gosen AK Pro 16|Nylon|1.31|182.3|21.2|94.7|4.3
Prince Premier Power 17|Nylon|1.25|146.3|19|96.0|4.3
Polyfibre Black Venom 16 (1.30)|Polyester|1.3|210.9|56.4|86.7|4.3
Gosen Polylon 17 (1.24)|Polyester|1.24|236.0|48.5|90.2|4.3
L-Tec Premium Pro OS 16L|Polyester|1.28|289.8|25.8|92.9|4.3
Poly Star Classic 16 (1.30)|Polyester|1.3|210.9|54.9|85.9|4.2
Gosen Polylon PolyBreak 17 (1.24)|Polyester|1.24|210.9|48.4|87.6|4.2
Klip Synthetic Gut 16|Nylon|1.29|165.7|24.1|94.7|4.2
Polyfibre Hightec Premium 16/1.30|Polyester|1.3|197.2|57.4|85.6|4.2
MSV Co.-Focus 16L|Polyester|1.27|206.9|49.2|89.5|4.2
Gamma Zo Ice 16|Polyester|1.27|256.6|37.4|90.4|4.2
Head Sonic Pro 16|Polyester|1.3|181.7|52.8|86.9|4.2
Gosen Compositemaster I 16|Nylon|1.28|170.9|20.7|94.1|4.2
Polyfibre TCS 17|Polyester|1.2|172.6|63.5|84.8|4.2
Weiss Cannon Turbotwist 17 (1.24)|Polyester|1.24|224.0|48.8|89.1|4.2
Weiss Cannon Scorpion 1.33|Polyester|1.33|247.5|47.4|90.2|4.2
Signum Pro Hyperion 17 (1.24)|Polyester|1.24|224.0|42.1|90.1|4.2
Tecnifibre Black Code 17|Polyester|1.24|256.6|39.7|89.5|4.2
Topspin Cyber Flash 17|Polyester|1.25|180.0|53.8|89.5|4.2
Wilson Spin Cycle 16L|Polyester|1.27|232.6|38.3|92.0|4.2
Tecnifibre Razor Code 16 (1.30)|Polyester|1.3|251.5|32.2|91.0|4.2
Head FXP Tour 16|Nylon/Polyester|1.3|128.6|21.7|94.9|4.2
Prince Premier Touch 17|Nylon|1.25|144.6|23.6|95.1|4.2
Luxilon 4G Rough 16L|Polyester|1.25|235.5|31.4|93.3|4.2
Kirschbaum Touch Multifibre 16|Nylon|1.3|165.2|22.6|94.7|4.1
Dunlop Tour Performance 16|Nylon|1.3|165.2|21.7|95.5|4.1
Gosen Polylon 16|Polyester|1.29|226.9|50.5|86.5|4.1
Tourna Big Hitter Silver Rough 17|Polyester|1.25|217.7|41.6|91.0|4.1
Dunlop DNA 17 (1.22)|Nylon|1.22|148.6|27.7|95.6|4.1
Gamma Zo Magic 16|Polyester|1.27|276.6|33|92.7|4.1
Polyfibre Poly Hightec 16/1.30|Polyester|1.3|196.6|57.7|85.9|4.1
Luxilon Big Banger XP 125/16L|Polyester|1.25|228.6|48.6|88.4|4.1
Klip K-Boom 16/1.30|Polyester|1.3|261.7|33.4|91.4|4.1
L-Tec Premium OS 17 (1.23)|Polyester|1.23|253.2|28.3|93.1|4.1
Prince Premier Touch 16|Nylon|1.3|156.0|21.2|95.6|4.1
Babolat SG SpiralTek 16|Nylon|1.3|160.6|14.1|95.1|4.1
Dunlop Comfort Synthetic 16|Nylon|1.3|181.2|19.2|94.9|4.1
Head Ultratour 17|Polyester|1.2|230.9|44.1|89.7|4.1
Head FXP 17|Nylon|1.24|179.5|19.7|92.5|4.1
Kirschbaum Pro Line I 17 (1.25)|Polyester|1.25|234.3|50.1|89.5|4.1
Kirschbaum Competition 17L (1.20)|Polyester|1.2|207.5|44.7|91.0|4.1
Luxilon Big Banger Ace 18 (1.12)|Polyester|1.12|222.9|45.7|90.1|4
Poly Star Classic 17 (1.20)|Polyester|1.2|189.2|61.6|83.9|4
Poly Star Energy 16 (1.30)|Polyester|1.3|192.6|66.1|83.4|4
Poly Star Energy 17 (1.20)|Polyester|1.2|187.5|63.3|83.9|4
Wilson Enduro Pro 17 (1.25)|Nylon/Polyester|1.25|246.3|32.4|91.8|4
Gosen Polylon SP 16 (1.30)|Polyester|1.3|209.2|52|89.1|4
Gamma Zo Black Ice 18 (1.18)|Polyester|1.18|233.7|39|91.4|4
L-Tec Premium 3S 16L (1.25)|Polyester|1.25|244.0|35|92.5|4
L-Tec Premium 5S 16L (1.25)|Polyester|1.25|241.2|36.3|91.2|4
Gosen Nanocubic 16|Nylon|1.31|192.0|20.2|95.5|4
Polyfibre Poly Hightec 17|Polyester|1.2|174.3|62.4|84.1|4
Weiss Cannon Explosiv 1.30|Nylon|1.3|150.3|24.8|94.3|4
Weiss Cannon Scorpion 1.22|Polyester|1.22|208.0|43.7|90.2|4
Leopard Plus Control 16|Polyester|1.3|258.3|39.4|89.5|3.9
Dunlop Juice 17 (1.26)|Polyester|1.26|212.0|46.4|89.5|3.9
Babolat RPM Team 16 Black|Polyester|1.3|306.3|21.6|93.5|3.9
Ashaway MonoGut 17|Polyester|1.22|212.0|49.7|88.9|3.9
Solinco Vanquish 16|Nylon|1.3|168.6|20.1|95.5|3.9
Gosen Powermaster I 16|Nylon|1.21|166.9|21.7|95.8|3.9
Prince Beast XP 16|Polyester|1.3|223.5|41.2|91.2|3.9
Head Sonic Pro 17|Polyester|1.25|184.0|54.2|88.4|3.9
Luxilon Big Banger Timo 17 (1.22)|Polyester|1.22|228.0|43.9|91.2|3.9
Kirschbaum Pro Line I 17L (1.20)|Polyester|1.2|213.2|51.8|87.4|3.9
Wilson NXT 16|Nylon|1.3|182.9|19.9|94.1|3.9
Wilson Hollow Core Pro 17|Nylon|1.27|158.3|33.3|93.7|3.9
Polyfibre Viper 17/1.20|Polyester|1.2|176.6|63.8|84.5|3.9
Polyfibre Poly Hightec 18|Polyester|1.1|166.3|60.6|86.5|3.9
Polyfibre Hightec Premium 17|Polyester|1.2|176.0|61.3|85.6|3.9
Head Synthetic Gut PPS 16|Nylon|1.34|182.3|22.7|95.5|3.9
Gamma Asterisk Spin 16|Nylon|1.33|154.3|23.9|95.3|3.9
Dunlop Synthetic Gut 16|Nylon|1.3|180.0|22.2|94.7|3.9
Luxilon 4G 16L (1.25)|Polyester|1.25|292.0|20.9|94.1|3.9
Gamma RZR Rx 16|Polyester|1.2|227.5|26.7|92.2|3.9
Gamma Monoblast 16|Polyester|1.27|256.0|41.7|92.2|3.8
Tecnifibre Polyspin 16L|Polyester|1.27|259.5|35.8|92.5|3.8
Head FXP 16|Nylon/Polyester|1.32|177.2|22.1|95.1|3.8
Babolat Xcel Power 16|Nylon|1.3|170.3|18.4|97.2|3.8
Babolat Super Fine Play 16|Nylon|1.3|198.3|21|96.2|3.8
Gamma Asterisk 16|Nylon|1.3|162.3|20.6|94.3|3.8
Gamma Zo Tour 16|Polyester|1.3|233.2|51.8|87.2|3.8
Prince Syn Gut Original 17|Nylon|1.25|182.9|15.7|94.9|3.8
Wilson NXT Tour 16|Nylon|1.3|186.9|20.6|93.7|3.8
Polyfibre TCS 16L|Polyester|1.25|181.7|61.7|85.2|3.8
Weiss Cannon Silverstring 1.25|Polyester|1.25|222.9|43.1|91.0|3.8
Mantis Comfort Synthetic 16|Nylon|1.3|150.3|23.8|95.5|3.8
Tecnifibre Pro Mix 17|Nylon/Polyester|1.25|180.6|34|92.0|3.7
Dunlop Hexy Fiber 17|Nylon|1.22|152.6|24.2|94.7|3.7
Weiss Cannon Silverstring 120|Polyester|1.2|183.5|49.8|89.5|3.7
Poly Star Energy 16L (1.25)|Polyester|1.25|188.0|67.6|81.5|3.7
Gamma Zo Black Ice 17 (1.23)|Polyester|1.23|244.6|40.8|90.8|3.7
Gamma Zo Tour 17 (1.25)|Polyester|1.25|217.7|49.7|87.8|3.7
Prince Twisted 16L|Polyester|1.27|261.7|43|90.4|3.7
Gosen Powermaster II 16|Nylon|1.21|161.2|21.8|96.8|3.7
Klip Kicker 16|Nylon|1.3|186.9|18.4|95.5|3.7
Head Synthetic Gut 16|Nylon|1.3|188.0|22.9|96.2|3.6
Gamma Synthetic Gut 16|Nylon|1.3|200.6|22.6|95.5|3.6
Dunlop DNA 16 (1.30)|Nylon|1.3|161.2|24.6|95.1|3.6
Dunlop Juice 16 (1.31)|Polyester|1.31|237.2|48|90.1|3.6
Dunlop Hexy Fiber 16|Nylon|1.3|146.9|24.6|95.1|3.6
Luxilon Big Banger XP 15L (1.38)|Polyester|1.38|266.9|47.6|90.1|3.6
Dunlop Explosive Synthetic 16|Nylon|1.3|183.5|20|94.5|3.6
Weiss Cannon MatchPower 1.25|Polyester|1.25|255.5|37.9|90.6|3.6
Luxilon M2 Pro 125/16|Polyester|1.25|210.3|52.6|88.0|3.6
Wilson Optimus 16 (1.30)|Nylon|1.3|144.6|21.6|95.3|3.6
Babolat Xcel Power 17|Nylon|1.25|153.2|21.1|95.3|3.6
Polyfibre Cobra 17/1.20|Polyester|1.2|172.0|63.3|84.5|3.6
Prince Synthetic Gut 18 Duraflex|Nylon|1.17|170.9|18.8|94.5|3.6
Luxilon Adrenaline 16|Polyester|1.3|236.0|45|92.0|3.6
Luxilon Big Banger Timo 18 (1.10)|Polyester|1.1|206.3|45|90.6|3.6
Wilson NXT Tour 17|Nylon|1.26|176.6|17.7|93.1|3.6
Wilson Sensation 17|Nylon|1.25|168.0|20.7|95.8|3.6
Prince Topspin W/ Duraflex 15L|Nylon|1.38|185.2|16.9|94.7|3.5
Prince Lightning XX 17|Nylon|1.25|177.2|18.7|96.4|3.5
Prince Premier LT 18|Nylon|1.2|157.2|27|95.6|3.5
Ashaway MonoGut 16L|Polyester|1.27|228.0|46.4|89.7|3.5
Pacific Power Line 17|Nylon|1.24|184.0|21.5|94.9|3.5
Dunlop Silk 17|Nylon|1.22|136.6|30.3|96.0|3.5
Tecnifibre NRG2 17/1.24|Nylon|1.24|167.4|14.6|96.2|3.5
Kirschbaum Touch Multifibre 17 (1.25)|Nylon|1.25|170.3|21.2|92.7|3.5
Gamma Prodigy 16|Nylon|1.32|176.0|20.7|95.5|3.5
Head Fibergel Spin 16|Nylon|1.3|176.0|24.3|95.1|3.5
Wilson Sensation 16|Nylon|1.3|179.5|20.7|95.1|3.5
Luxilon Adrenaline 16L/1.25|Polyester|1.25|226.9|44|91.8|3.5
Dunlop X-Life Synthetic 15L|Nylon|1.4|183.5|21.5|93.9|3.5
Dunlop Explosive Poly Max 16|Nylon/Polyester|1.3|177.7|22.9|94.9|3.4
SuperString Nikita Original 1.25|Polyester|1.25|220.6|42.3|90.8|3.4
Luxilon Savage 16/1.27|Polyester|1.27|258.3|45.9|90.1|3.4
Prince Lightning XX 16|Nylon|1.3|185.2|18.3|95.6|3.4
Prince Tour 17|Polyester|1.25|222.9|55.1|88.9|3.4
Forten Sweet 16|Nylon|1.3|190.9|22.1|94.7|3.4
Pacific Power Line 16L|Nylon|1.28|182.3|18.7|97.0|3.4
Prince Recoil 16|Nylon|1.3|182.9|22.8|94.9|3.4
Tourna Big Hitter Blue Rough 16|Polyester|1.3|246.3|40.3|91.4|3.4
Yonex Poly Tour Pro Yellow 16 (1.30)|Polyester|1.3|210.3|44.1|92.2|3.4
Dunlop Silk 16 (1.30)|Nylon|1.3|159.4|25.4|95.5|3.4
Gamma TNT2 Touch 16|Nylon|1.32|174.3|25.6|93.9|3.4
Gosen OG-Sheep Micro 16|Nylon|1.29|192.0|20.7|94.1|3.4
Gamma Asterisk Tour 16|Nylon/Zyex|1.32|170.9|24.1|94.7|3.4
Ashaway Dynamite WB 16|Nylon/Zyex|1.34|137.2|32.2|92.9|3.3
Luxilon Adrenaline Rough 16L/1.25|Polyester|1.25|223.5|44.2|89.7|3.3
Luxilon Monotec Super Poly 1.25/16L|Polyester|1.25|253.2|43.5|92.0|3.3
Pacific Premium Power X 16L|Nylon|1.27|167.4|23.7|96.0|3.3
Prince Premier LT 17|Nylon|1.25|154.3|29|94.5|3.3
Prince Premier W/Softflex 16|Nylon|1.3|169.2|24.6|94.9|3.3
Prince Poly Spin 3D|Polyester|1.27|199.5|59.9|85.6|3.3
Wilson Hollow Core 16|Nylon|1.33|167.4|33.2|94.1|3.3
Babolat Pro Hurricane 18|Polyester|1.2|210.9|36.4|91.4|3.3
Tecnifibre Multi-Feel 16|Nylon/Polyurethane|1.3|172.0|20.9|94.9|3.3
IsoSpeed Axon Mono 16L|Polyester|1.25|229.7|34|92.4|3.2
Klip Scorcher 16/1.30|Nylon|1.3|168.0|24|94.3|3.2
Pacific Power Twist 16L|Nylon|1.28|169.7|22.1|94.3|3.2
Gamma TNT2 16|Nylon|1.32|185.2|21.1|94.3|3.2
Tecnifibre NRG2 16|Nylon|1.32|168.6|17.9|93.9|3.2
Wilson Extreme 16 Synthetic Gut|Nylon|1.3|187.5|19.2|96.2|3.2
Gosen OG Sheep Micro 17|Nylon|1.22|168.0|22.9|93.7|3.2
Gosen OG Sheep Micro 18|Nylon|1.15|168.6|20.9|94.3|3.2
Volkl Power-Fiber II 16|Nylon|1.32|172.0|20.4|94.1|3.2
Tourna Big Hitter Blue Rough 17|Polyester|1.25|233.2|43.3|90.4|3.2
Gamma Glide Cross String 16|Nylon|1.3|134.3|21.6|96.4|3.2
Prince Premier W/ Softflex 17|Nylon|1.25|156.0|22.2|94.9|3.2
Prince Tour 16|Polyester|1.3|234.9|52.4|87.2|3.1
Prince Synthetic Gut Multifilament 17|Nylon|1.24|173.7|21.9|93.3|3.1
Babolat Pro Hurricane 17|Polyester|1.25|212.0|41.1|92.0|3.1
Babolat Addiction 16|Nylon|1.3|180.0|19.5|97.8|3.1
Prince Tournament Nylon 15L|Nylon|1.38|185.7|19.1|94.7|3.1
Tecnifibre TGV 16|Nylon/Polyurethane|1.3|167.4|24.3|94.7|3.1
Babolat FiberTour 16|Nylon|1.3|165.7|22.3|95.8|3.1
Gamma TNT2 Pro Plus 16|Nylon|1.3|164.6|25.1|94.7|3.1
Wilson SGX 16|Nylon|1.3|166.9|18.5|97.4|3.1
Head Fibergel Power 17|Nylon|1.24|180.6|23.7|93.9|3.1
Dunlop S-Gut 17|Nylon/Polyurethane|1.22|172.0|20.7|94.5|3.1
Alpha Gut 2000 16|Nylon|1.33|161.2|15.7|96.4|3.1
Babolat Xcel 16|Nylon|1.3|161.7|18.2|96.4|3
Head Fibergel Power 16|Nylon|1.3|163.4|32.1|92.7|3
Wilson Stamina 16|Nylon|1.32|196.0|20.6|95.1|3
Wilson Sensation Supreme 16|Nylon|1.3|152.0|27.4|94.5|3
Tecnifibre XR3 17|Nylon/Polyurethane|1.25|166.3|17.5|95.3|3
Wilson NXT Control 16 (1.32)|Nylon/Polyester|1.32|173.7|30.5|93.1|3
Tourna Irradiated 16|Nylon|1.33|176.0|22.9|94.3|3
IsoSpeed Axon Multi 16L|Nylon/Polyolefin|1.25|135.4|28|94.5|3
Ashaway Dynamite 17|Nylon/Zyex|1.25|135.4|29.8|92.5|3
Wilson Red Alert 16|Nylon|1.32|200.6|19|93.9|3
Tecnifibre TGV 17/1.25|Nylon/Polyurethane|1.25|174.3|20.3|94.3|3
Luxilon Adrenaline 17/1.20|Polyester|1.2|237.7|41.5|91.2|2.9
Volkl Power-Fiber II 18|Nylon|1.18|166.9|21.4|97.8|2.9
Tecnifibre XR3 16|Nylon/Polyurethane|1.3|177.7|20.4|95.5|2.9
Prince Syn Gut Original 16|Nylon|1.3|189.7|20.1|96.4|2.9
Gamma Zo Power 16L|Polyester|1.25|219.5|55.9|87.6|2.9
Gamma WearGuard Synthetic Gut 16|Nylon|1.3|178.9|21.3|92.9|2.8
Wilson Synthetic Gut Extreme 17|Nylon|1.25|188.6|18.4|94.7|2.8
Pacific Classic Natural Gut 16|Gut|1.34|100.0|14.1|98.6|2.8
Gamma Professional 17|Nylon|1.27|153.2|22.5|96.8|2.8
Babolat Attraction 16|Nylon/Polyurethane|1.3|170.9|19.6|95.3|2.7
Babolat VS Natural ThermoGut 16 Touch|Gut|1.3|106.3|18.1|97.4|2.7
Gamma Professional Spin 16|Nylon/Zyex|1.35|179.5|22.9|95.1|2.7
Tecnifibre E-Matrix 16|Nylon/Polyurethane|1.3|154.3|19.6|95.8|2.7
Gosen OG Sheep Micro Super 16L|Nylon|1.25|178.3|20.9|95.3|2.7
Volkl Power-Fiber II 17|Nylon|1.25|169.2|19|91.4|2.7
Prince Synthetic Gut Multifilament 16|Nylon|1.3|177.7|19.4|94.7|2.7
Klip Excellerator 16/1.30|Nylon|1.3|172.0|19.5|95.5|2.7
Babolat Addiction 17|Nylon|1.25|162.3|19.6|95.8|2.6
Tecnifibre Pro Mix 16|Nylon/Polyester|1.3|168.0|37.3|93.1|2.6
Ashaway Dynamite Soft 17|Nylon/Zyex|1.25|127.4|27.6|94.7|2.6
Head RIP Control 16|Nylon/Polyolefin|1.3|173.2|21.4|95.5|2.6
Gamma ESP 16|Nylon|1.32|160.6|26.5|94.3|2.6
Gamma Live Wire 16|Nylon/Zyex|1.32|166.3|28.7|95.5|2.6
Head PerfectControl 16|Polyolefin|1.3|161.7|19.3|96.4|2.6
Gamma Live Wire XP 16|Nylon/Zyex|1.32|162.3|24.1|94.3|2.6
Tecnifibre NRG2 18 (1.18)|Nylon/Polyurethane|1.18|160.6|19.3|95.8|2.6
Tecnifibre Multi-Feel 17 (1.25)|Nylon/Polyurethane|1.25|165.7|20.4|94.1|2.6
Wilson NXT Max 16|Nylon|1.32|185.2|20.1|94.1|2.5
Wilson NXT OS|Nylon|1.28|176.0|18.2|95.3|2.5
Gamma Professional 16|Nylon/Zyex|1.32|152.6|24.4|93.9|2.4
IsoSpeed Energetic Plus 16|Nylon/Polyester|1.3|167.4|21.9|94.7|2.4
Wilson Reaction 16|Nylon|1.3|150.3|25.9|94.9|2.4
Tecnifibre E-Matrix 17|Nylon|1.24|154.9|18.6|96.8|2.4
Wilson Shock Shield 16|Nylon|1.33|169.7|31.9|94.7|2.3
IsoSpeed Control Classic 16|Polyolefin|1.3|142.3|30.6|93.7|2.3
Head RIP PerfectPower 16|Nylon/Polyolefin|1.31|168.6|22.3|94.7|2.3
Klip Venom 16/1.30|Nylon|1.3|174.9|20.2|94.7|2.3
Wilson Hollow Core Pro 16|Nylon|1.3|157.7|31.2|93.3|2.2
Wilson Natural Gut 17|Gut|1.25|83.4|14.5|98.0|2.2
Tecnifibre Duramix HD 16|Nylon/Polyester|1.3|176.0|33.7|92.2|2.2
Luxilon Monotec Supersense 16L/1.25|Polyester|1.25|232.6|47.2|89.9|2.1
Tecnifibre X-One Biphase 17|Nylon/Polyurethane|1.24|165.2|14.6|95.1|2.1
Tecnifibre X-Code 16|Polyester|1.3|215.5|37.5|91.4|2
Wilson NXT 17|Nylon|1.24|168.6|22.3|98.0|2
Pacific PMX 16L|Nylon|1.28|157.7|25.4|93.7|2
Head ETS 17|Nylon|1.24|162.3|20.5|96.0|1.9
IsoSpeed Energetic 17|Nylon/Polyolefin|1.2|166.9|33.5|92.2|1.9
Head ETS 16|Nylon|1.31|168.6|23.8|94.7|1.9
Pacific Tough Gut 16|Gut|1.34|115.4|19.3|94.5|1.8
Tecnifibre Duramix HD 17|Nylon/Polyester|1.25|180.0|31.5|93.1|1.7
IsoSpeed Professional Classic 17|Polyolefin|1.2|142.9|27.6|93.5|1.6
Tecnifibre X-One Biphase 16|Nylon/Polyurethane|1.3|166.9|17.2|96.6|1.6
Wilson K-Gut Pro 16|Nylon|1.33|184.0|17.8|94.5|1.6
Tecnifibre X-One Biphase 18|Nylon|1.18|158.3|18.4|96.8|1.6
Klip Armour Pro 16/1.30|Gut|1.3|112.0|15.7|97.2|1.4
Wilson Natural Gut 16|Gut|1.3|97.7|16.7|95.8|1.3
Klip Legend 16 Uncoated|Gut|1.3|105.2|14.5|97.8|1.2
Prince Tournament Poly 16|Polyester|1.3|249.7|45.5|88.9|
Babolat VS Natural Team Gut 17 (1.25)|Gut|1.25|93.2|14.1|97.4|
Babolat Xcel Premium 17|Nylon|1.25|157.7|19.2|95.8|
Tourna Quasi-Gut 16|Nylon|1.3|169.2|24|94.3|
SuperString Nikita Soft 16L|Polyester|1.25|202.3|48.7|88.4|
MSV Hepta-Twist 16|Polyester|1.3|204.6|50.8|88.0|
Gosen Nanoblend 17|Nylon|1.24|132.6|26.7|95.3|
Signum Pro Poly-Plasma Pure 17L (1.18)|Polyester|1.18|216.6|43.7|89.7|
Super String Tour Players V3 17 (1.20)|Polyester|1.2|218.3|44.5|89.7|
Polyfibre TCS 18 (1.15)|Polyester|1.15|172.6|60.7|85.0|
Polyfibre Black Venom 16L (1.25)|Polyester|1.25|189.2|59.9|85.6|
Yonex Poly Tour Pro Yellow 16L (1.25)|Polyester|1.25|198.9|45.9|90.8|
Babolat Duralast 16|Polyester|1.3|230.3|47.9|89.3|
Boris Becker Bomber 17|Polyester|1.23|203.5|47.8|87.6|
IsoSpeed Control 16|Nylon/Polyolefin|1.3|157.2|24.4|94.3|
IsoSpeed Pulse 17|Polyester|1.2|170.3|55|86.9|
Tecnifibre Black Code 16|Polyester|1.28|264.6|37|89.5|
Polyfibre Viper 16L/1.25|Polyester|1.25|189.7|59.7|85.9|
Luxilon 4G S 15|Polyester|1.41|332.0|23|93.5|
Luxilon 4G 16 (1.30)|Polyester|1.3|317.2|23|92.7|
One Strings Carbon Tour 17 (1.25)|Polyester|1.25|249.7|24.7|92.2|
Wilson Enduro Gold 16|Polyester|1.3|230.3|46.5|89.3|
Yonex Tournament 50 16L|Nylon|1.27|176.6|20.1|94.7|
Yonex Poly Tour 130/16|Polyester|1.3|232.6|48.7|88.2|
Luxilon M2 Plus 130/16|Polyester|1.3|226.9|51.3|88.4|
Luxilon Monotec Zolo 125/16|Polyester|1.25|224.6|47.7|89.1|
Pacific PMX 17|Nylon|1.23|145.2|26.1|94.5|
Pacific Tough Gut 16L|Gut|1.28|104.0|14.9|98.8|
Babolat Tonic + Natural Gut 16|Gut|1.35|103.4|14.3|96.6|
LaserFibre Supernatural Gut Pro Stock 16|Nylon|1.3|168.0|26.4|95.1|
Babolat Pro Hurricane 16|Polyester|1.3|226.9|38.9|92.0|
Gamma Revelation 16|Nylon/Zyex|1.32|169.2|24.9|95.5|
Prince Synthetic Gut 17 Duraflex|Nylon|1.22|192.6|20.3|96.2|
Prince Synthetic Gut 16 Duraflex|Nylon|1.3|181.7|19.6|93.3|
Prince Tournament Poly 17|Polyester|1.24|224.0|50.7|86.7|
Wilson Enduro Tour 18|Polyester|1.21|178.3|63.3|85.2|
Luxilon Big Banger ALU Power Fluoro 17|Polyester|1.23|228.6|44.3|91.0|
Wilson Enduro Mono 16L|Polyester|1.28|265.7|40.9|88.4|
Pacific Prime Natural Gut 16L|Gut|1.25|98.9|13.4|96.0|
Tourna Big Hitter Blue 16|Polyester|1.3|252.6|36.9|89.1|
Tourna Big Hitter 16|Polyester|1.3|256.0|39.2|89.7|
Volkl Gripper 16|Nylon|1.3|166.9|21.5|97.0|
Babolat Duralast 17|Polyester|1.25|258.9|42.6|88.9|
Babolat Revenge 16|Polyester|1.3|304.0|36.7|90.4|
Babolat Revenge 17|Polyester|1.25|249.7|48.3|88.2|
SuperString VooDoo Tour V9 17|Nylon/Polyester|1.2|166.3|31|93.7|
Ashaway Dynamite Soft 18|Nylon/Zyex|1.15|114.9|27.7|92.4|
SuperString Pure Control V8 17|Polyester|1.2|185.7|49.9|90.2|
Dunlop Comfort Synthetic 17|Nylon|1.25|188.6|18.5|94.7|
Dunlop Explosive Synthetic Gut 17|Nylon|1.25|177.2|17.7|95.8|`;

// Poliésteres em condição complementar — só entram se o modelo não existir em RAW_A.
const RAW_B = `Weiss Cannon Ultra Cable 17 (1.23)|Polyester|1.23|174.9|47.7|82.8|11.9
Volkl V-Square 16 (1.30)|Polyester|1.3|190.9|47.9|83.7|11.3
Weiss Cannon Blue Rock N Power|Polyester|1.2|224.0|27|88.7|11.1
Babolat RPM Blast Rough 17|Polyester|1.25|196.0|35.7|86.1|9.9
Toroline O-Toro 17 (1.23)|Polyester|1.23|165.7|44.4|84.3|9.4
Diadem Elite XT 17|Polyester|1.2|189.2|31.7|89.3|9.3
Toroline Absolute 17 (1.20)|Polyester|1.2|180.6|47.1|81.9|9.3
Tecnifibre Black Code 4S 16 (1.30)|Polyester|1.3|242.9|25.5|89.5|9.2
Volkl Cyclone 18L (1.15)|Polyester|1.15|188.0|29.4|88.2|9
Volkl Cyclone Tour 16 (1.30)|Polyester|1.3|167.4|52.1|83.2|8.7
Diadem Elite XT 16|Polyester|1.3|204.6|40.4|85.9|8.7
Toroline O-TORO Snap 16L (1.25)|Polyester|1.25|164.6|41.7|84.6|8.7
MSV Focus-Hex 16 (1.27)|Polyester|1.27|185.7|43.3|84.6|8.6
Tecnifibre Razor Spin 17/1.25|Polyester|1.25|222.3|26.5|89.9|8.6
Weiss Cannon Red Ghost 17L (1.18)|Polyester|1.18|189.7|34|87.2|8.5
Volkl V-Torque Tour 16 (1.30)|Polyester|1.3|184.0|38.3|88.2|8.5
Pacific Poly Power Pro 16 (1.30)|Polyester|1.3|194.9|43.7|85.0|8.3
Luxilon ECO Power 17 (1.25)|Polyester|1.25|194.9|34.5|86.3|8.3
Babolat RPM Blast Rough 16|Polyester|1.3|209.7|29.5|90.1|8.2
Toroline O-Toro Spin 17 (1.23)|Polyester|1.23|173.2|38.3|85.4|8.2
Grapplesnake Tour M8 17 (1.25)|Polyester|1.25|210.3|34.3|87.0|8.2
Solinco Revolution 16L (1.25)|Polyester|1.25|212.6|28.4|88.5|8
Prince Vortex 16 (1.30)|Polyester|1.3|188.0|58.5|80.6|8
Volkl Cyclone Tour 18 (1.20)|Polyester|1.2|159.4|51.3|84.6|7.8
Toroline Super Toro 17 (1.23)|Polyester|1.23|189.7|34.7|85.2|7.8
MSV Focus-Hex +38 16L (1.25)|Polyester|1.25|173.2|53.5|81.5|7.7
Toroline O-Toro Tour 17 (1.23)|Polyester|1.23|216.6|25|86.5|7.7
Yonex Poly Tour Drive 16L (1.25)|Polyester|1.25|195.5|47.1|84.1|7.6
Toroline Cash 16L (1.25)|Polyester|1.25|182.9|34.8|85.0|7.6
Solinco Hyper-G 18 (1.15)|Polyester|1.15|180.0|28.3|88.4|7.5
MSV Focus-Hex 16 (1.23)|Polyester|1.23|218.9|29.1|89.1|7.5
Head Hawk Power 17 (1.25)|Polyester|1.25|203.5|48.3|81.7|7.5
Tecnifibre Razor Soft 17 (1.25)|Polyester|1.25|212.0|33.3|88.4|7.4
Diadem Solstice Power 16L (1.25)|Polyester|1.25|209.2|27.1|88.5|7.3
MSV Focus Hex Soft 17L (1.20)|Polyester|1.2|194.3|25.8|89.7|7.3
Signum Pro Plasma HEXtreme 16 (1.30)|Polyester|1.3|225.7|24.8|88.9|7.3
Solinco Tour Bite Soft 18 (1.15)|Polyester|1.15|172.0|31.3|88.4|7.3
Babolat RPM Blast Rough 15L|Polyester|1.35|199.5|37|86.3|7.3
Babolat RPM Blast 15L (1.35)|Polyester|1.35|236.6|32.9|86.1|7.3
Solinco Hyper-G 16 Round (1.30)|Polyester|1.3|226.3|32.3|88.0|7.3
Toroline Snapper 17 (1.23)|Polyester|1.23|190.9|35.9|84.6|7.3
MSV Co-Focus 17L (1.18)|Polyester|1.18|185.7|31|88.5|7.2
Solinco Tour Bite 19 (1.10)|Polyester|1.1|171.5|32.2|89.9|7.2
Yonex Polytour Rev 16L (1.25)|Polyester|1.25|193.2|34.4|87.6|7.2
Diadem Solstice Power 15L (1.35)|Polyester|1.35|228.6|29.6|88.9|7.1
Diadem Solstice Pro 15L (1.35)|Polyester|1.35|192.6|28|88.9|7.1
Gamma Ocho 17 (1.25)|Polyester|1.25|231.5|21|89.1|7.1
Kirschbaum Xplosive Speed 1.25|Polyester|1.25|185.7|41.4|86.5|7.1
Head Lynx Tour 17 (1.25)|Polyester|1.25|217.7|24.6|89.7|7.1
Gamma Moto Soft 17 (1.24)|Polyester|1.24|184.0|34.8|87.0|7
Luxilon Element Rough 16 (1.30)|Polyester|1.3|198.3|34.9|87.6|7
Babolat RPM Blast Orange 16 (1.30)|Polyester|1.3|210.3|38.9|84.3|7
Luxilon Element Soft IR 1.27|Polyester|1.27|197.7|43.7|82.8|7
Gamma Ocho 16 (1.30)|Polyester|1.3|242.9|23.3|90.4|6.9
Kirschbaum Max Power Rough 18 (1.20)|Polyester|1.2|195.5|27.8|89.9|6.8
Tourna Big Hitter Silver 16|Polyester|1.25|209.2|26.3|88.0|6.8
Prince Tour XP 17 (1.25)|Polyester|1.25|189.2|36.1|86.9|6.7
Prince Tour XR 15L (1.35)|Polyester|1.35|213.2|48.6|81.9|6.7
Gamma Jet 16L (1.28)|Polyester|1.28|197.7|37.6|87.6|6.7
Grapplesnake Alpha 17 (1.25)|Polyester|1.25|218.3|29.4|89.3|6.7
Gosen Lumina Spin 16L (1.26)|Polyester|1.26|178.3|50|85.9|6.6
Pacific XCite 16 (1.30)|Polyester|1.3|220.0|26.7|87.6|6.6
Solinco Outlast 18 (1.15)|Polyester|1.15|186.3|26.9|90.6|6.6
MSV Focus Hex 17L (1.18) v2|Polyester|1.18|224.0|27.5|88.2|6.5
Solinco Outlast 16L (1.25)|Polyester|1.25|208.0|28.8|88.7|6.5
Volkl V-Star 18L (1.15)|Polyester|1.15|174.3|33.1|88.5|6.5
Volkl V-Star 19 (1.10)|Polyester|1.1|166.9|35.7|88.9|6.5
Tecnifibre Pro Red Code Wax 17|Polyester|1.25|235.5|28.8|87.8|6.5
Luxilon ALU Power Rough 16L (1.25)|Polyester|1.25|209.2|39.6|87.4|6.5
Solinco Confidential Soft 16L (1.25)|Polyester|1.25|194.3|27.7|86.9|6.5
Prince Tour XT 18 v2|Polyester|1.18|184.0|38.2|88.0|6.4
Gamma Moto Soft 16 (1.29)|Polyester|1.29|200.0|31.4|88.0|6.4
Gamma IO 18 (1.18)|Polyester|1.18|188.6|30.4|87.6|6.4
Head Hawk 16 (1.30)|Polyester|1.3|230.3|28.5|88.0|6.4
LaserFibre Vorso 16 (1.28)|Polyester|1.28|180.6|51.5|85.2|6.4
Solinco Confidential 16 (1.30)|Polyester|1.3|222.3|22.2|89.5|6.4
MSV Focus Hex Soft 17 (1.25) v2|Polyester|1.25|228.0|29.4|91.4|6.3
Gamma Moto 17 (1.24)|Polyester|1.24|201.7|25.7|87.8|6.3
Gamma IO Soft 15L (1.40)|Polyester|1.4|219.5|32.9|88.0|6.3
Head Hawk 18 (1.20)|Polyester|1.2|194.3|28.9|88.0|6.3
Head Lynx 18 (1.20)|Polyester|1.2|174.9|45.6|85.2|6.3
Solinco Revolution 18 (1.16)|Polyester|1.16|195.5|28.7|88.9|6.3
Yonex Poly Tour Spin 16L (1.25)|Polyester|1.25|213.7|27.2|88.5|6.3
Signum Pro Yellow Jacket 17g (1.22)|Polyester|1.22|197.7|32.6|88.4|6.3
Y-Tex Quadro Twist 16L v2|Polyester|1.26|177.7|48.5|84.8|6.2
Klip K-Boom 18 (1.20)|Polyester|1.2|190.3|31.5|87.0|6.2
LaserFibre Vorso 17 (1.23)|Polyester|1.23|177.7|42.2|87.0|6.2
Polyfibre Black Venom Rough 16L (1.25)|Polyester|1.25|162.3|60.8|80.8|6.2
Genesis Black Magic 16 (1.29)|Polyester|1.29|207.5|36.1|86.1|6.2
Signum Pro X-Perience 17 (1.24)|Polyester|1.24|224.6|25.2|87.8|6.2
Head Lynx Touch 16g (1.30)|Polyester|1.3|221.7|31.3|87.4|6.2
Gamma Zo Verve 17 v2|Polyester|1.25|230.9|25.3|89.5|6.1
Gamma IO Soft 16 (1.28)|Polyester|1.28|200.0|33.7|88.9|6.1
Kirschbaum Max Power 18 (1.20)|Polyester|1.2|226.3|21.8|89.1|6.1
Solinco Hyper-G 17 (1.20)|Polyester|1.2|194.9|25.7|88.4|6.1
Tecnifibre Black Code 15L (1.32)|Polyester|1.32|210.3|29.5|87.6|6.1
Tecnifibre Black Code 4S 18 (1.20)|Polyester|1.2|210.3|25.4|88.4|6.1
Tecnifibre Razor Code 18 (1.20)|Polyester|1.2|216.6|28.3|88.7|6.1
Wilson Revolve 15 (1.35)|Polyester|1.35|192.0|41.6|86.3|6.1
Solinco Hyper-G 16L (1.25)|Polyester|1.25|218.3|24.7|89.5|6.1
Head Lynx Tour 16 (1.30)|Polyester|1.3|228.6|30.5|87.6|6.1
Kirschbaum Max Power Rough 16 (1.30)|Polyester|1.3|230.9|28.3|87.8|6
Tourna Black Zone 17|Polyester|1.2|186.9|31.5|88.0|6
Volkl V-Torque 18 (1.18)|Polyester|1.18|157.2|45.7|85.7|6
Solinco Mach 10 16 (1.30)|Polyester|1.3|222.3|26.3|87.0|6
Prince Tour XC 17L v2|Polyester|1.22|205.7|36.6|88.0|5.9
Gamma IO Soft 17 (1.23)|Polyester|1.23|192.6|33.9|87.2|5.9
Gamma Zo Verve 16 (1.32)|Polyester|1.32|229.2|22.2|90.4|5.9
Kirschbaum Max Power 16 (1.30)|Polyester|1.3|233.2|20.9|90.4|5.9
Prince Tour XR 17 (1.25)|Polyester|1.25|203.5|42.2|84.8|5.9
Signum Pro Tornado 18 (1.17)|Polyester|1.17|167.4|39.1|86.1|5.9
Solinco Tour Bite Soft 16L (1.25)|Polyester|1.25|192.0|29.3|88.5|5.8
Solinco Tour Bite 20 (1.05)|Polyester|1.05|136.0|47.3|87.2|5.8
Topspin Cyber Whirl 17 (1.24)|Polyester|1.24|204.0|27|87.8|5.8
Yonex Poly Tour Fire 16L (1.25)|Polyester|1.25|194.9|35|86.5|5.8
Grapplesnake Tour Sniper 1.25|Polyester|1.25|206.3|32|85.6|5.8
Dunlop Black Widow 18 (1.21)|Polyester|1.21|194.9|30.9|89.7|5.8
Dunlop Ice 16 (1.30)|Polyester|1.3|204.6|45.4|85.0|5.8
Gosen Polylon Premium 16 (1.32)|Polyester|1.32|217.7|31|88.9|5.8
Pacific XCite 16L (1.25)|Polyester|1.25|206.3|27.8|87.6|5.8
Signum Pro Hyperion 18 (1.18)|Polyester|1.18|184.0|36.1|85.6|5.8
Solinco Tour Bite 18 (1.15) v2|Polyester|1.15|161.7|50.6|84.8|5.8
Gamma IO 17 (1.23)|Polyester|1.23|197.7|29.8|89.3|5.7
Head Lynx 17 (1.25)|Polyester|1.25|179.5|47|84.6|5.7
Solinco Tour Bite Soft 17 (1.20)|Polyester|1.2|186.3|29.2|87.0|5.7
Yonex Poly Tour HS 16L (1.25)|Polyester|1.25|198.3|28.5|88.2|5.7
Kirschbaum Xplosive Speed 1.30|Polyester|1.3|193.2|43.3|86.9|5.7
Gosen Poly Professional 17 (1.24)|Polyester|1.24|169.2|44.6|86.5|5.6
Kirschbaum Max Power Rough 17 (1.25)|Polyester|1.25|223.5|26.4|89.7|5.6
Solinco Barb Wire 16L (1.25)|Polyester|1.25|182.9|33.5|85.4|5.6
Topspin Cyber Delta 17 (1.26)|Polyester|1.25|200.6|34.7|87.8|5.6
Tecnifibre Razor Code 17 (1.25)|Polyester|1.25|229.2|29.6|88.7|5.6
Tourna Big Hitter Black 7 16 (1.25)|Polyester|1.25|222.9|24.3|88.9|5.6
Weiss Cannon Mosquito Bite 18 (1.16)|Polyester|1.16|182.3|35.4|87.8|5.6
Tecnifibre Ice Code 16 (1.30)|Polyester|1.3|221.2|35|88.0|5.6
Prince Tour XS 16 v2|Polyester|1.25|196.6|36.2|89.5|5.5
Boris Becker Bomber NYC 17 (1.23)|Polyester|1.23|205.7|27.4|89.3|5.5
Luxilon Element 16L (1.25)|Polyester|1.25|208.0|33.6|88.2|5.5
Prince Tour XR 16 (1.30)|Polyester|1.3|214.9|40.9|85.4|5.5
Signum Pro Firestorm 16 (1.30)|Polyester|1.3|185.7|43|83.9|5.5
Kirschbaum Touch Turbo 16L (1.275) v2|Polyester|1.275|196.0|48.5|84.5|5.4
Luxilon ALU Power Feel 18/1.20 v2|Polyester|1.2|186.9|42.9|87.0|5.4
Solinco Tour Bite Diamond Rough 16L v2|Polyester|1.25|191.5|47|85.7|5.4
Gosen Polylon Premium 16L (1.27)|Polyester|1.27|201.2|32.7|89.5|5.4
Gosen Poly Professional 16 (1.29)|Polyester|1.29|186.3|44.3|86.1|5.4
Signum Pro Poly Plasma 17 (1.23)|Polyester|1.23|198.3|26|87.8|5.4
Poly Star Turbo 16 (1.30) v2|Polyester|1.3|165.2|66.7|77.3|5.3
Double AR Raptor 1.27 v2|Polyester|1.27|238.3|22.3|89.5|5.3
Boris Becker Bomber NYC 16 (1.28)|Polyester|1.28|208.0|28.2|89.3|5.3
Gamma Zo Dart 17 (1.25)|Polyester|1.25|206.9|26.7|88.7|5.3
Pacific Poly Power Pro 16L (1.25)|Polyester|1.25|180.0|47.4|84.1|5.3
Polyfibre Panthera 16 (1.30)|Polyester|1.3|212.6|28.7|88.0|5.3
Yonex Poly Tour Tough 16L|Polyester|1.25|193.7|41.2|85.7|5.3
Gosen G-Tour 16 (1.30)|Polyester|1.3|184.0|31.1|86.9|5.3
Luxilon ECO Spin 17 (1.25)|Polyester|1.25|213.2|26.4|85.4|5.3
Kirschbaum Super Smash Spiky 17 (1.25) v2|Polyester|1.25|214.3|51|82.8|5.2
Polyfibre Hexablade 17L (1.18) v2|Polyester|1.18|168.6|63.8|79.0|5.2
Head Hawk Touch 18 (1.20)|Polyester|1.2|196.0|31.9|88.9|5.2
Yonex Poly Tour Pro 17 (1.20)|Polyester|1.2|188.6|33.3|87.0|5.2
Solinco Hyper-G-Soft 16L (1.25)|Polyester|1.25|172.0|28.7|88.0|5.2
Poly Star Strike 16 (1.30) v2|Polyester|1.3|201.2|49.1|82.8|5.1
Kirschbaum Pro Line X 16 (1.30) v2|Polyester|1.3|240.0|27.2|88.0|5.1
Babolat RPM Blast 18 (1.20)|Polyester|1.2|189.2|36.1|87.4|5.1
Dunlop Explosive 17 (1.26)|Polyester|1.26|192.0|32.4|87.2|5.1
IsoSpeed V18 19 (1.12)|Polyester|1.12|180.0|40.4|86.5|5.1
Solinco Tour Bite 15L (1.35)|Polyester|1.35|238.9|23.7|88.2|5.1
Topspin Cyber Blue 17L (1.20)|Polyester|1.2|184.6|33.7|87.4|5.1
RS RS Lyon 17L (1.20)|Polyester|1.2|182.9|36.7|87.8|5.1
Pacific Poly Force Xtreme 16L v2|Polyester|1.25|218.3|39.6|84.3|5
SuperString Viper V2 Rough 16L v2|Polyester|1.25|194.3|38.3|88.2|5
Poly Star Turbo 16L (1.25) v2|Polyester|1.25|168.6|64.9|77.8|5
Prince Tour XS 1.35 v2|Polyester|1.35|195.5|36.9|90.1|5
Dunlop Ice 17 (1.25)|Polyester|1.25|192.6|39.8|85.6|5
Dunlop Explosive 18 (1.20)|Polyester|1.2|194.3|28.7|89.5|5
Yonex Poly Tour HS 16 (1.30)|Polyester|1.3|213.7|28.1|88.4|5
Wilson Revolve Spin 16|Polyester|1.3|172.6|54.5|85.5|5
Luxilon Alu Power Vibe 16 (1.25)|Polyester|1.25|208.0|34.3|86.9|5
Tourna Big Hitter Blue 17 v2|Polyester|1.25|222.3|36.3|87.2|4.9
Kirschbaum P2 17 (1.25) v2|Polyester|1.25|235.5|33.9|89.7|4.9
Solinco Barb Wire 17 (1.20) v2|Polyester|1.2|186.3|42.6|85.7|4.9
Kirschbaum Pro Line Evolution 17 (1.25)|Polyester|1.25|208.0|28.9|88.9|4.9
Head Hawk Touch 19 (1.15)|Polyester|1.15|192.0|32.8|88.4|4.9
Weiss Cannon Scorpion 16L (1.28)|Polyester|1.28|200.0|35.2|87.2|4.9
Head Hawk Rough 17|Polyester|1.25|201.2|23.9|90.6|4.9
LaserFibre Native Tour 17 (1.25)|Polyester|1.25|200.0|46.1|83.9|4.9
Weiss Cannon Turbotwist 17L (1.18) v2|Polyester|1.18|203.5|48.6|84.1|4.8
Signum Pro Poly Megaforce 17 (1.19) v2|Polyester|1.19|213.2|36.3|86.7|4.8
Mantis Comfort Poly 16 v2|Polyester|1.3|224.6|40.2|86.3|4.8
Kirschbaum Pro Line II 17L (1.20) v2|Polyester|1.2|193.2|46|86.3|4.8
Kirschbaum P2 17L (1.20) v2|Polyester|1.2|197.2|41.6|85.2|4.8
Poly Star Strike 16L (1.25) v2|Polyester|1.25|184.0|51.4|82.1|4.8
Gosen Polylon PolyBreak 18 (1.20) v2|Polyester|1.2|165.2|53.3|82.8|4.8
Kirschbaum Pro Line X 17 (1.25) v2|Polyester|1.25|218.3|37|86.9|4.8
Head Sonic Pro Edge 16 v2|Polyester|1.3|194.9|38.5|87.0|4.8
Yonex Poly Tour Spin G 1.25 v2|Polyester|1.25|237.2|25.7|89.7|4.8
Gamma RZR Rx 17|Polyester|1.23|185.2|28.7|88.2|4.8
Tecnifibre Ruff Code 16 (1.30)|Polyester|1.3|207.5|31.3|87.4|4.8
Wilson Enduro Pro 16 v2|Polyester|1.3|219.5|36.3|86.7|4.7
Pacific X Force 18 v2|Polyester|1.19|208.6|37|86.1|4.7
Gamma Zo Twist 16 v2|Polyester|1.28|190.3|46.3|86.7|4.7
Babolat Hurricane Feel 16 v2|Polyester|1.3|249.7|30.7|88.4|4.7
Kirschbaum Pro Line II 17 (1.25) v2|Polyester|1.25|201.2|44.9|84.5|4.7
Weiss Cannon Black 5 Edge 17 (1.24) v2|Polyester|1.24|215.5|32.8|89.7|4.7
Head Hawk 17 (1.25) v2|Polyester|1.25|204.6|32.9|88.0|4.7
Kirschbaum Long Life 15 v2|Polyester|1.38|231.5|55.4|80.3|4.6
Tecnifibre Black Code 18 v2|Polyester|1.18|202.9|40.7|87.4|4.6
Gosen Polylon SP 17 (1.24) v2|Polyester|1.24|174.9|52.2|85.4|4.6
Gosen Sidewinder 17 v2|Polyester|1.23|159.4|46.7|85.0|4.6
Yonex Poly Tour Strike 16L (1.25)|Polyester|1.25|199.5|27.9|88.4|4.6
LaserFibre JB Tour 100 17g (1.25)|Polyester|1.25|210.9|44.3|84.3|4.6
Head Ultra Tour 16 v2|Polyester|1.27|201.7|45.1|85.9|4.5
Dunlop Comfort Poly 17 v2|Polyester|1.25|236.6|42.1|87.0|4.5
Babolat RPM Blast 16 v2|Polyester|1.3|232.6|45.9|85.4|4.5
Kirschbaum Competition 17 (1.25) v2|Polyester|1.25|210.3|47.5|84.5|4.5
Tourna Big Hitter Silver Rough 16 v2|Polyester|1.3|206.3|45|86.1|4.5
Alien Black Diamond 16 v2|Polyester|1.3|190.3|50.7|83.0|4.5
Luxilon Big Banger TiMO 17L (1.17) v2|Polyester|1.17|204.0|45.9|86.5|4.4
Solinco Barb Wire 16 v2|Polyester|1.3|214.3|40.2|86.9|4.4
Babolat Hurricane Feel 17 v2|Polyester|1.25|239.5|31.9|87.6|4.4
Poly Star Classic 16L (1.25) v2|Polyester|1.25|174.9|54.5|81.7|4.4
Pacific X Force 16L (1.29)|Polyester|1.29|219.5|25|88.7|4.4
Signum Pro Poly Speed Spin 1.28 v2|Polyester|1.28|246.3|40.9|84.8|4.3
Luxilon Big Banger ALU Power Spin 127/16 v2|Polyester|1.27|213.7|45|85.7|4.3
Polyfibre TCS Rapid 16L/1.25 v2|Polyester|1.25|160.0|64.3|78.7|4.3
Polyfibre Black Venom 16 (1.30) v2|Polyester|1.3|180.0|56.9|80.6|4.3
Gosen Polylon 17 (1.24) v2|Polyester|1.24|208.0|48.8|83.2|4.3
L-Tec Premium Pro OS 16L v2|Polyester|1.28|253.7|26.4|89.9|4.3
Solinco Tour Bite Diamond Rough 17 (1.20) v2|Polyester|1.2|181.7|43.5|87.0|4.3
MSV Co.-Focus 16L v2|Polyester|1.27|184.6|49.7|85.2|4.2
Gamma Zo Ice 16 v2|Polyester|1.27|223.5|37.8|85.2|4.2
Head Sonic Pro 16 v2|Polyester|1.3|160.6|57|81.2|4.2
Polyfibre TCS 17 v2|Polyester|1.2|158.9|63.4|78.7|4.2
Weiss Cannon Turbotwist 17 (1.24) v2|Polyester|1.24|216.6|49.5|85.0|4.2
Weiss Cannon Scorpion 1.33 v2|Polyester|1.33|222.9|47.8|84.3|4.2
Signum Pro Hyperion 17 (1.24) v2|Polyester|1.24|202.3|42.6|84.8|4.2
Tecnifibre Black Code 17 v2|Polyester|1.24|236.0|40.2|87.0|4.2
Topspin Cyber Flash 17 v2|Polyester|1.25|158.9|54.9|83.4|4.2
Poly Star Classic 16 (1.30) v2|Polyester|1.3|185.7|55.8|81.5|4.2
Gosen Polylon PolyBreak 17 (1.24) v2|Polyester|1.24|195.5|48.9|84.8|4.2
Wilson Spin Cycle 16L v2|Polyester|1.27|205.7|38.7|87.6|4.2
Tecnifibre Razor Code 16 (1.30) v2|Polyester|1.3|242.9|32.7|87.8|4.2
Luxilon 4G Rough 16L v2|Polyester|1.25|216.0|32.8|89.7|4.2
Yonex Poly Tour Air 16L|Polyester|1.25|154.9|41|88.0|4.2
Luxilon Big Banger XP 125/16L v2|Polyester|1.25|209.2|49|84.6|4.1
Klip K-Boom 16/1.30 v2|Polyester|1.3|237.2|34|87.2|4.1
Gamma Zo Magic 16 v2|Polyester|1.27|248.0|33.7|89.3|4.1
Head Ultratour 17 v2|Polyester|1.2|207.5|44.9|85.0|4.1
Kirschbaum Pro Line I 17 (1.25) v2|Polyester|1.25|204.6|50.8|83.2|4.1
Kirschbaum Competition 17L (1.20) v2|Polyester|1.2|190.3|45|86.1|4.1
Tourna Big Hitter Silver Rough 17 v2|Polyester|1.25|197.2|42.1|85.7|4.1
L-Tec Premium OS 17 (1.23) v2|Polyester|1.23|224.0|28.8|87.0|4.1
Weiss Cannon Scorpion 1.22 v2|Polyester|1.22|192.6|44.2|86.9|4
Luxilon Big Banger Ace 18 (1.12) v2|Polyester|1.12|203.5|46.1|85.4|4
Poly Star Energy 16 (1.30) v2|Polyester|1.3|173.2|66.3|76.6|4
Gosen Polylon SP 16 (1.30) v2|Polyester|1.3|184.6|52.5|84.1|4
Gamma Zo Black Ice 18 (1.18) v2|Polyester|1.18|199.5|39.6|87.8|4
L-Tec Premium 3S 16L (1.25) v2|Polyester|1.25|220.0|35.6|87.8|4
L-Tec Premium 5S 16L (1.25) v2|Polyester|1.25|210.3|36.8|88.2|4
Ashaway MonoGut 17 v2|Polyester|1.22|188.6|50.9|83.5|3.9
Polyfibre Viper 17/1.20 v2|Polyester|1.2|157.7|64.3|78.0|3.9
Prince Beast XP 16 v2|Polyester|1.3|198.9|41.7|87.2|3.9
Luxilon Big Banger Timo 17 (1.22) v2|Polyester|1.22|206.9|44.3|85.9|3.9
Kirschbaum Pro Line I 17L (1.20) v2|Polyester|1.2|194.9|52.2|83.7|3.9
Dunlop Juice 17 (1.26) v2|Polyester|1.26|208.6|45.8|89.3|3.9
Babolat RPM Team 16 Black v2|Polyester|1.3|280.6|22|90.4|3.9
Luxilon 4G 16L (1.25) v2|Polyester|1.25|258.9|21.3|90.8|3.9
Gamma RZR Rx 16 v2|Polyester|1.2|196.0|27.3|88.5|3.9
Gamma Monoblast 16 v2|Polyester|1.27|220.6|42.5|86.9|3.8
Tecnifibre Polyspin 16L v2|Polyester|1.27|226.9|36.3|85.6|3.8
Weiss Cannon Silverstring 1.25 v2|Polyester|1.25|195.5|43.8|87.0|3.8
Gosen Sidewinder 16 (1.31)|Polyester|1.31|163.4|46.7|86.5|3.8
Prince Twisted 16L v2|Polyester|1.27|230.3|43.5|85.0|3.7
Poly Star Energy 16L (1.25) v2|Polyester|1.25|169.7|68|75.5|3.7
Gamma Zo Black Ice 17 (1.23) v2|Polyester|1.23|211.5|41.2|87.2|3.7
Gamma Zo Tour 17 (1.25) v2|Polyester|1.25|204.0|50.3|83.7|3.7
Weiss Cannon MatchPower 1.25 v2|Polyester|1.25|218.3|38.4|86.7|3.6
Luxilon M2 Pro 125/16 v2|Polyester|1.25|181.7|53|83.2|3.6
Luxilon Adrenaline 16 v2|Polyester|1.3|212.6|45.3|86.1|3.6
Luxilon Big Banger Timo 18 (1.10) v2|Polyester|1.1|189.2|45.4|85.9|3.6
Polyfibre Cobra 17/1.20 v2|Polyester|1.2|154.3|63.7|79.6|3.6
Luxilon Big Banger XP 15L (1.38) v2|Polyester|1.38|236.6|48|84.5|3.6
Dunlop Juice 16 (1.31) v2|Polyester|1.31|215.5|48.4|85.4|3.6
Ashaway MonoGut 16L v2|Polyester|1.27|202.9|47|85.0|3.5
Luxilon Adrenaline 16L/1.25 v2|Polyester|1.25|202.9|44.3|86.1|3.5
Prince Tour 17 v2|Polyester|1.25|198.9|55.6|81.7|3.4
SuperString Nikita Original 1.25 v2|Polyester|1.25|198.9|42.9|85.7|3.4
Luxilon Savage 16/1.27 v2|Polyester|1.27|234.3|46.2|84.3|3.4
Tourna Big Hitter Blue Rough 16 v2|Polyester|1.3|222.3|40.5|86.7|3.4
Yonex Poly Tour Pro Yellow 16 (1.30) v2|Polyester|1.3|191.5|44.5|87.0|3.4
Luxilon Monotec Super Poly 1.25/16L v2|Polyester|1.25|233.2|44.1|86.3|3.3
Prince Poly Spin 3D v2|Polyester|1.27|178.9|60.2|80.3|3.3
Babolat Pro Hurricane 18 v2|Polyester|1.2|185.2|37.2|87.0|3.3
Luxilon Adrenaline Rough 16L/1.25 v2|Polyester|1.25|202.9|44.8|85.9|3.3
IsoSpeed Axon Mono 16L v2|Polyester|1.25|199.5|34.4|88.7|3.2
Tourna Big Hitter Blue Rough 17 v2|Polyester|1.25|209.7|43.8|85.0|3.2
Prince Tour 16 v2|Polyester|1.3|214.9|53|81.4|3.1
Babolat Pro Hurricane 17 v2|Polyester|1.25|192.6|42|84.6|3.1
Gamma Zo Power 16L v2|Polyester|1.25|193.2|56.7|81.7|2.9
Luxilon Adrenaline 17/1.20 v2|Polyester|1.2|208.0|41.8|86.3|2.9`;

function parse(raw: string, skip: Set<string>): TwuString[] {
  const out: TwuString[] = [];
  for (const line of raw.split("\n")) {
    const f = line.split("|");
    if (f.length < 7) continue;
    const name = f[0].replace(/ v2$/, "").trim();
    if (skip.has(name.toLowerCase())) continue;
    const num = (s: string) => {
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : undefined;
    };
    const gauge = num(f[2]);
    out.push({
      name,
      material: f[1] || "—",
      gauge: gauge && gauge >= 1 && gauge <= 1.5 ? f[2] : undefined,
      stiffness: num(f[3]),
      tensionLoss: num(f[4]),
      energyReturn: num(f[5]),
      spin: num(f[6]),
    });
    skip.add(name.toLowerCase());
  }
  return out;
}

const seen = new Set<string>();
export const TWU_STRINGS: TwuString[] = [...parse(RAW_A, seen), ...parse(RAW_B, seen)].sort(
  (a, b) => a.name.localeCompare(b.name)
);

export function materialPT(m: string): string {
  switch (m) {
    case "Polyester": return "Poliéster";
    case "Gut": return "Tripa Natural";
    case "Nylon": return "Nylon / Syn. Gut";
    case "Polyolefin": return "Poliolefina";
    default: return m.startsWith("Nylon/") ? "Multifilamento" : m;
  }
}

export function searchStrings(query: string, limit = 20): TwuString[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return TWU_STRINGS.filter((s) => {
    const hay = (s.name + " " + s.material).toLowerCase();
    return terms.every((t) => hay.includes(t));
  }).slice(0, limit);
}

export function findString(name: string): TwuString | undefined {
  const n = name.trim().toLowerCase();
  return (
    TWU_STRINGS.find((s) => s.name.toLowerCase() === n) ??
    TWU_STRINGS.find((s) => s.name.toLowerCase().includes(n) || n.includes(s.name.toLowerCase()))
  );
}
