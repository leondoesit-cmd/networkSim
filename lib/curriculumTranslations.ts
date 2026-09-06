import { ElevationZone, LearningNode } from '@/data/curriculumData';
import { MunicipalSite } from '@/components/NetworkTopologyExplorer';
import { PathScenario, PathHop } from '@/components/PacketPathVisualizer';
import { Language } from './translations';

// English Elevation Zones
export const EN_ELEVATION_ZONES: Record<number, { name: string; subtitle: string; description: string }> = {
  0: {
    name: 'Foundations & Passive Infrastructure',
    subtitle: 'Basecamp - 0m: OSI Model, IP Addressing, Optical Fiber & Physical Cabling',
    description: 'The absolute bedrock of every network: from individual patch cords and fiber transceivers to IP subnetting and layered architecture.'
  },
  250: {
    name: 'Local Switching, VLANs & Campus Trunks',
    subtitle: 'Camp 1 - 250m: L2 Access, VLAN Tagging (802.1Q), STP/RSTP & PoE+',
    description: 'Mastering enterprise campus access: segmenting municipal departments, loop-free resilience, and powering IP endpoints.'
  },
  500: {
    name: 'Core Routing, Inter-VLAN & High Availability',
    subtitle: 'Camp 2 - 500m: SVI, VRRP/HSRP, OSPF Dynamic Routing & Multi-Gigabit Trunks',
    description: 'Layer 3 distribution and core spine engineering: routing municipal packets across municipal sites with sub-second failover.'
  },
  750: {
    name: 'Smart City, Wireless & Field Telemetry',
    subtitle: 'Camp 3 - 750m: Outdoor Wi-Fi 6, 4K CCTV/LPR, 60GHz Point-to-Point & IoT Sensors',
    description: 'High-availability municipal field edge: smart intersections, public park hotspots, environmental sensors, and IP telephony (CUCM).'
  },
  1000: {
    name: 'Network Security, NOC C2 & Incident Command',
    subtitle: 'Summit - 1000m: 802.1X (ISE), PRTG/Zabbix Monitoring, FortiGate Firewalls & Field Triage',
    description: 'The pinnacle of municipal network leadership: rapid diagnostic triage, real-time NOC telemetry, cyber defense, and emergency readiness.'
  }
};

// English Node Overrides
export const EN_NODE_MAP: Record<string, {
  title: string;
  subtitle: string;
  categoryLabel: string;
  summary: string;
}> = {
  node_01: {
    title: 'OSI 7-Layer Model & Municipal Encapsulation',
    subtitle: 'Packet journey from citizen smartphone to municipal core server',
    categoryLabel: 'Infrastructure & Cabling',
    summary: 'A deep conceptual understanding of PDU encapsulation (Bits -> Frames -> Packets -> Segments -> Data) and mapping real municipal issues to their exact OSI layer.'
  },
  node_02: {
    title: 'IPv4 Addressing, Subnetting & Municipal VLSM',
    subtitle: 'Binary masks, CIDR notations, and IP allocation for schools and city departments',
    categoryLabel: 'Switching & Campus WAN',
    summary: 'Mastering fast binary calculation of network IDs, broadcast addresses, and assignable host ranges for city facilities, traffic lights, and municipal offices.'
  },
  node_03: {
    title: 'Physical Cabling: Cat6A, Patch Panels & Industrial Keystones',
    subtitle: 'S/FTP shielding, T568B crimping, TDR cable verification and PoE limits',
    categoryLabel: 'Infrastructure & Cabling',
    summary: 'Hands-on standards for copper media in harsh outdoor municipal environments, noise suppression near high-voltage lines, and TDR diagnostics.'
  },
  node_04: {
    title: 'Fiber Optics: Single-Mode (OS2), Multi-Mode (OM4) & SFP+',
    subtitle: 'LC/APC vs LC/UPC connectors, OTDR attenuation budgets and optical transceivers',
    categoryLabel: 'Infrastructure & Cabling',
    summary: 'City-wide optical trunking: 1310nm/1550nm lasers, dBm optical power measurement, and diagnosing dirty or damaged fiber splices.'
  },
  node_05: {
    title: 'VLAN Segmentation & 802.1Q Campus Trunking',
    subtitle: 'Access ports vs 802.1Q Trunks, Native VLAN security, and inter-building isolation',
    categoryLabel: 'Switching & Campus WAN',
    summary: 'Isolating critical city networks (Moked 106, municipal cameras, schools, guest Wi-Fi) across campus switches with hardened trunk configs.'
  },
  node_06: {
    title: 'Spanning Tree Protocol (STP / RSTP / MSTP)',
    subtitle: 'Root bridge election, BPDU Guard, loop-free redundant campus links',
    categoryLabel: 'Switching & Campus WAN',
    summary: 'Eliminating broadcast storms in municipal fiber loops while enabling 1-second failovers using IEEE 802.1w Rapid Spanning Tree.'
  },
  node_07: {
    title: 'Enterprise PoE/PoE+ (802.3af/at/bt) Power Delivery',
    subtitle: 'Power budget management, switch PSU redundancy, and remote camera rebooting',
    categoryLabel: 'Infrastructure & Cabling',
    summary: 'Managing PoE budgets across 48-port Catalyst switches, powering high-draw PTZ cameras, IR illuminators, and IP phones.'
  },
  node_08: {
    title: 'Inter-VLAN Routing & L3 Core Switches (SVI)',
    subtitle: 'Switched Virtual Interfaces, line-rate ASIC routing, and core default gateways',
    categoryLabel: 'Switching & Campus WAN',
    summary: 'Eliminating router-on-a-stick bottlenecks by leveraging high-throughput Layer 3 hardware forwarding for inter-departmental city traffic.'
  },
  node_09: {
    title: 'First Hop Redundancy (HSRP / VRRP) & Gateway Failover',
    subtitle: 'Virtual IP sharing, preemptive priority, and seamless core switch failover',
    categoryLabel: 'Switching & Campus WAN',
    summary: 'Ensuring zero downtime for city hall and emergency dispatch by coupling dual core switches with VRRP/HSRP virtual gateways.'
  },
  node_10: {
    title: 'OSPF Dynamic Routing & Municipal Campus WAN',
    subtitle: 'Area 0 spine, Cost calculation based on optical bandwidth, and loopback stability',
    categoryLabel: 'Switching & Campus WAN',
    summary: 'Configuring dynamic routing across all municipal facilities, auto-rerouting packets during underground optical fiber breaks.'
  },
  node_11: {
    title: 'Smart City Edge: LPR Traffic Cameras & Moxa Switches',
    subtitle: 'DIN-rail ruggedized hardware, multicast video streams, and traffic cabinet deployment',
    categoryLabel: 'Smart City',
    summary: 'Deploying high-reliability rugged switches at outdoor street intersections to aggregate license plate recognition and traffic light telemetry.'
  },
  node_12: {
    title: 'Campus & Park Outdoor Wi-Fi 6 (802.11ax) Infrastructure',
    subtitle: 'Aruba APs, CAPWAP tunneling, roaming handoffs, and RF cell planning',
    categoryLabel: 'Smart City',
    summary: 'Designing high-density wireless networks for municipal parks, council chambers, and public events with centralized controller management.'
  },
  node_13: {
    title: 'Municipal VoIP & IP Telephony (Cisco CUCM)',
    subtitle: 'SIP signaling, RTP voice streams, QoS DSCP EF (Expedited Forwarding), and Voice VLAN',
    categoryLabel: 'Security & VoIP',
    summary: 'Prioritizing emergency 106 dispatch phone calls with jitter-free low-latency QoS queues and automated LLDP-MED handset provisioning.'
  },
  node_14: {
    title: 'Network Access Control (802.1X) & Perimeter Firewalls',
    subtitle: 'RADIUS / Cisco ISE profiling, dynamic VLAN assignment, and FortiGate security policies',
    categoryLabel: 'Security & VoIP',
    summary: 'Enforcing zero-trust network access: automatically quarantining unauthorized rogue hardware and inspecting inter-zone firewall traffic.'
  },
  node_15: {
    title: 'NOC Command & Control: PRTG, SNMPv3, Syslog & NetFlow',
    subtitle: 'Real-time bandwidth monitoring, threshold alerting, and proactive optic telemetry',
    categoryLabel: 'Monitoring & C2',
    summary: 'Centralized municipal network supervision: catching optic attenuation warnings and interface errors before users report an outage.'
  },
  node_16: {
    title: 'Field Troubleshooting Methodology & CLI Diagnostics',
    subtitle: 'Top-down & bottom-up triage, port mirroring, packet captures and emergency workarounds',
    categoryLabel: 'Field Incidents & CLI',
    summary: 'The ultimate skill of a Level II engineer: methodical isolation of complex field incidents under time pressure using standard CLI tools.'
  }
};

// English Topology Sites
export const EN_SITES_MAP: Record<string, {
  name: string;
  role: string;
  address: string;
}> = {
  city_hall_dc: {
    name: 'City Hall Core Data Center',
    role: 'Central Spine, Core Catalysts, VMS Storage & Firewall Cluster',
    address: '103 Ahuza Street, Ra\'anana'
  },
  moked_106: {
    name: 'Dispatch 106 & Municipal Security',
    role: 'Emergency Dispatch, IP Telephony (CUCM), Security Operations',
    address: '8 Rambam Street, Ra\'anana'
  },
  raanana_park: {
    name: 'Ra\'anana Park & Amphitheater',
    role: 'High-Density Outdoor Wi-Fi 6, 4K CCTV & Public Address Systems',
    address: 'Park Road, Ra\'anana'
  },
  country_club: {
    name: 'Country Club & Sports Complex',
    role: 'Microwave 60GHz Wireless Backhaul, Access Control & Guest Wi-Fi',
    address: '1 Sheshet HaYamim St, Ra\'anana'
  },
  weizmann_junction: {
    name: 'Weizmann Junction Smart Intersection',
    role: 'LPR Camera Array, Traffic Light Telemetry, Moxa Rugged Switch',
    address: 'Ahuza / Weizmann Junction, Ra\'anana'
  },
  alon_school: {
    name: 'Alon High School & Community Campus',
    role: 'Education Network, Computer Labs, DHCP Snooping & PoE+ Access',
    address: '28 HaGalil Street, Ra\'anana'
  },
  welfare_building: {
    name: 'Social Welfare & Public Services',
    role: 'Secure Government Databases, 802.1X Port Security & Strict ACLs',
    address: '14 Ben Gurion Street, Ra\'anana'
  },
  isp_edge: {
    name: 'Internet Edge & Gov-Net POP',
    role: 'Dual 10G Transit: Bezeq Metro Dark Fiber + Partner IP-VPN Backup',
    address: 'Municipal Edge POP'
  }
};

// English Scenarios
export const EN_SCENARIOS: Record<string, {
  title: string;
  shortDesc: string;
  sourceLabel: string;
  targetLabel: string;
  totalDistance: string;
  avgLatency: string;
  hops: Record<string, Partial<PathHop>>;
}> = {
  lpr_camera: {
    title: 'Smart LPR Camera at Weizmann Junction ➔ VMS Video Server in Municipal Core DC',
    shortDesc: 'A real-time 8 Mbps video journey: from optical CMOS sensor, through shielded Cat6A, Moxa rugged switch, 1310nm Single-Mode fiber, L3 routing on Catalyst 9500 to SAN storage.',
    sourceLabel: 'Ahuza / Weizmann Junction (Traffic Pole)',
    targetLabel: 'Municipal Core DC (RACK-04 VMS Storage)',
    totalDistance: '2.4 km Optical Fiber',
    avgLatency: '1.4 ms',
    hops: {
      lpr_hop_1: {
        title: 'Pixel Sampling, H.265 Compression & 30W PoE Power',
        subtitle: 'Camera sensor converts photons to electrical signals and packages video frames',
        locationName: 'Traffic light pole at Ahuza / Weizmann junction',
        signalDescription: 'Continuous 48V DC power (PoE) along with high-frequency data signals',
        hardwareName: 'Smart License Plate Recognition (LPR) Camera',
        hardwareRole: '60fps license plate capture, on-board OCR recognition, and RTSP stream generation',
        whatHappensHardware: 'The CMOS sensor turns light into analog voltage, the on-board DSP compresses frames into H.265. The camera draws 24.5 Watts for high-power infrared night illumination.',
        whatHappensSoftware: 'Camera firmware establishes an RTSP session (port 554), slices stream into standard 1500-byte MTU packets, and tags RTP timestamps.',
        mentalModelTitle: 'Video is not one file — it is a river of thousands of fragments',
        mentalModelDescription: 'An IP camera never sends a single image file; it breaks every second into dozens of micro-packets. Losing even one packet causes macroblocking screen artifacts.',
        fieldTrapTitle: 'Cameras dropping offline right at sunset (PoE Budget)',
        fieldTrapDescription: 'During daytime the camera consumes 8W, but at dusk when IR illuminators activate, draw spikes to 25W. If the switch port was left at 802.3af (15.4W) instead of 802.3at (PoE+), the camera reboots into an infinite loop!'
      },
      lpr_hop_2: {
        title: 'Heavy-Duty Cat6A S/FTP Cabling & Industrial Keystone',
        subtitle: 'Differential signaling guided through electromagnetic noise suppression shielding',
        locationName: 'Underground conduit beneath Ahuza Road & Weizmann intersection',
        signalDescription: 'Differential electrical pulses ±2.5V utilizing PAM-16 encoding',
        hardwareName: 'Cat6A S/FTP Shielded Solid Copper Cable',
        hardwareRole: 'Delivering Gigabit Ethernet and PoE power adjacent to high-voltage traffic light power lines',
        whatHappensHardware: 'Bits travel as differential voltage pulses across 4 twisted pairs. The braided screen and individual foil shields cancel magnetic induction from electric motors and vehicle inductors.',
        whatHappensSoftware: 'At Layer 1, the switch and camera PHY transceivers align clock frequencies (Clock Recovery) and verify cable pinouts (Auto-MDIX).',
        mentalModelTitle: 'Why are the wire pairs twisted? The magic of self-cancellation',
        mentalModelDescription: 'When external electromagnetic noise hits the cable, it couples equally into both wires of a twisted pair. When the receiver computes (A - B), the noise cancels to zero and only original data remains!',
        fieldTrapTitle: 'Stripping the shield at the terminal block (Unshielded Keystone)',
        fieldTrapDescription: 'If a field installer crimps an expensive shielded cable into a cheap unshielded plastic keystone without bonding drain wire to chassis ground, the shield acts as an antenna collecting noise instead of blocking it!'
      },
      lpr_hop_3: {
        title: 'Moxa Rugged Switch: VLAN 50 Isolation & 802.1Q Tagging',
        subtitle: 'Switch receives Ethernet frame, learns source MAC, and tags frame for optical trunk',
        locationName: 'Traffic control cabinet at Ahuza / Weizmann junction',
        signalDescription: 'ASIC hardware switching logic and CAM table lookup',
        hardwareName: 'Industrial DIN-Rail Rugged Managed Switch',
        hardwareRole: 'L2 switching, PoE+ delivery under extreme outdoor temperatures (-40°C to 75°C), and VLAN tagging',
        whatHappensHardware: 'The Moxa switching ASIC inspects the camera source MAC, records it in the CAM table, and checks destination MAC. Because destination is outside local subnet, it targets default gateway MAC.',
        whatHappensSoftware: 'Before forwarding the frame out the optical SFP+ trunk port, the switch injects a 4-byte 802.1Q header containing VLAN ID: 50, Priority: 4 (Video).',
        mentalModelTitle: 'The VLAN tag is a "department color sticker"',
        mentalModelDescription: 'An Access port peels off the sticker when sending data to the camera, and slaps the sticker back on (VLAN 50) when traffic enters the trunk. The camera itself never sees the VLAN tag!',
        fieldTrapTitle: 'Mismatched Native VLAN on Trunk link',
        fieldTrapDescription: 'If the Moxa switch has Native VLAN 1 and the upstream Cisco core switch is configured with Native VLAN 99, untagged control traffic will hop VLANs, creating silent security breaches and Spanning Tree inconsistencies.'
      },
      lpr_hop_4: {
        title: 'Single-Mode Optical Fiber: 1310nm Laser Pulse Injection',
        subtitle: 'SFP+ transceiver modulates laser into underground city fiber conduit',
        locationName: 'Underground municipal fiber conduit along Ahuza street',
        signalDescription: 'Infrared optical laser pulses at 1310nm wavelength traveling via Total Internal Reflection',
        hardwareName: '10GBASE-LR Single-Mode SFP+ Transceiver & OS2 Optical Fiber',
        hardwareRole: 'High-speed long-haul transmission connecting municipal field sites directly to City Hall Core DC',
        whatHappensHardware: 'The semiconductor laser diode in the SFP+ turns electrical 1s and 0s into infrared flashes. Photons bounce through a microscopic 9-micron silica glass core.',
        whatHappensSoftware: 'Layer 2 Ethernet framing wraps continuous bitstreams with 64b/66b line coding, maintaining clock lock and scrambling bits to prevent DC baseline drift.',
        mentalModelTitle: 'A beam of light inside a 9-micron glass tunnel',
        mentalModelDescription: 'The core of single-mode fiber is thinner than a human hair (9μm). Light travels in a straight single mode without modal dispersion, allowing 10Gbps across tens of kilometers with minimal loss.',
        fieldTrapTitle: 'Dust on the optical ferrule (Microscopic contamination)',
        fieldTrapDescription: 'A single microscopic speck of dust on the 9μm optical core will block 3 to 6 dB of signal. An optical link may report link up, but drop packets under high video load.'
      },
      lpr_hop_5: {
        title: 'City Hall Core DC: L3 Routing on Cisco Catalyst 9500',
        subtitle: 'Stripping 802.1Q tag, looking up CEF routing table, rewriting MAC headers',
        locationName: 'City Hall Core Data Center - Rack 01 (Spine)',
        signalDescription: 'Cisco Silicon One / UADP ASIC forwarding engine line-rate lookup',
        hardwareName: 'Modular Enterprise Core Switch Stack',
        hardwareRole: 'Municipal Layer 3 spine routing, access-list firewalling, and SVI gateway for all municipal VLANs',
        whatHappensHardware: 'Optical photons hit photodiode array, converting light back to digital signals. UADP ASIC queries Ternary Content Addressable Memory (TCAM) for wire-speed routing.',
        whatHappensSoftware: 'Catalyst checks SVI 50 IP (10.24.50.1), decrements TTL from 64 to 63, computes new IPv4 checksum, and replaces source MAC with SVI 10 MAC address.',
        mentalModelTitle: 'The Router is an envelope replacer',
        mentalModelDescription: 'When a packet crosses subnets, the IP addresses remain unchanged! Only the Layer 2 Ethernet envelope (MAC addresses) is torn off and replaced at every routing hop.',
        fieldTrapTitle: 'Forgotten IP routing command or missing SVI',
        fieldTrapDescription: 'If an engineer configures an SVI interface and IP address but no active port in that VLAN is UP, the SVI stays administratively down and all traffic is blackholed.'
      },
      lpr_hop_6: {
        title: 'Server Ingress & VMS Storage SAN Ingestion',
        subtitle: 'TCP/UDP socket reception, H.265 frame assembly, and iSCSI block storage write',
        locationName: 'City Hall Core Data Center - Rack 04 (Storage)',
        signalDescription: 'PCIe Gen4 x16 bus data transfer and NVMe over Fabrics storage commit',
        hardwareName: 'Enterprise Milestone XProtect VMS Server & SAN Storage',
        hardwareRole: 'Continuous 4K video recording, LPR plate metadata indexing, and municipal dispatch display',
        whatHappensHardware: 'Intel X520 10G NIC generates hardware interrupt, DMA controller transfers frame buffers into kernel memory, and NVMe drives persist video blocks.',
        whatHappensSoftware: 'Milestone VMS reorders RTP sequence numbers, feeds H.265 parser, matches license plate against Police stolen vehicle database, and updates dispatch dashboard.',
        mentalModelTitle: 'The Journey is Complete: Light ➔ Pulse ➔ Packet ➔ Persisted Video',
        mentalModelDescription: 'In under 1.5 milliseconds, a physical vehicle plate on Ahuza road became an archived, searchable record in the central municipal security operations center.',
        fieldTrapTitle: 'RTP UDP packet drops causing video freezing',
        fieldTrapDescription: 'Because video streaming uses UDP without retransmission, if a switch port encounters buffer overruns (Oversubscription), the camera image will smear with gray squares.'
      }
    }
  },
  moked_106_voip: {
    title: 'Emergency Call 106 Dispatch ➔ Cisco CUCM CallManager Cluster',
    shortDesc: 'End-to-end voice path: acoustic sampling to G.711u codec, Voice VLAN 30 tagging, QoS DSCP EF (Expedited Forwarding), L3 priority routing to Cisco CallManager.',
    sourceLabel: 'Citizen Dispatch Console (Cisco 8845 IP Phone)',
    targetLabel: 'City Hall Core DC (Cisco CUCM Telephony Cluster)',
    totalDistance: '850m Fiber Ring',
    avgLatency: '0.8 ms',
    hops: {
      voip_hop_1: {
        title: 'Acoustic Sampling & G.711u DSP Voice Encoding',
        subtitle: 'Handset microphone samples human voice at 8kHz, packing 20ms RTP packets',
        locationName: 'Dispatch 106 Control Center Desk #04',
        signalDescription: 'Microphone analog audio converted to 64 Kbps uncompressed digital stream',
        hardwareName: 'Enterprise Video IP Phone with Hardware DSP',
        hardwareRole: 'Low-latency voice encoding, hardware acoustic echo cancellation, and SIP signaling',
        whatHappensHardware: 'The phone DSP digitizes voice at 8,000 samples per second with 8-bit precision (G.711u 64Kbps). Every 20ms, it generates a 160-byte payload.',
        whatHappensSoftware: 'The phone encapsulates the audio inside RTP/UDP. Crucially, it marks the IP header with DSCP 46 (EF - Expedited Forwarding) for strict priority.',
        mentalModelTitle: 'Voice cannot tolerate waiting in line',
        mentalModelDescription: 'A web page can load half a second late with no harm, but 50ms of audio delay creates intolerable robotic stutter. Voice packets must jump ahead of all other traffic!',
        fieldTrapTitle: 'Mismatched voice codec causing silent calls',
        fieldTrapDescription: 'If the IP phone tries to negotiate G.729 (compressed) while the SIP Trunk only accepts G.711u, the call will connect but neither side will hear any sound.'
      },
      voip_hop_2: {
        title: 'Voice VLAN & 802.1p CoS Tagging via LLDP-MED',
        subtitle: 'Switch advertises Voice VLAN to phone via LLDP-MED protocol',
        locationName: 'Floor network patch panel at 106 Dispatch building',
        signalDescription: 'Tagged Ethernet frame on shared PC-to-Phone access port',
        hardwareName: 'Cisco Catalyst 9300-48P with StackWise-480',
        hardwareRole: 'Supplying 7W PoE to phone, separating CAD PC data from Voice, and honoring QoS trust',
        whatHappensHardware: 'Phone and switch communicate via LLDP-MED. The switch tells the phone: "Use VLAN 30 for your voice packets, and mark them with 802.1p Priority 5".',
        whatHappensSoftware: 'The PC connected to the back of the phone stays in untagged VLAN 35, while the phone voice stream is tagged in VLAN 30.',
        mentalModelTitle: 'One cable — two isolated parallel worlds',
        mentalModelDescription: 'Voice VLAN allows saving a second cable drop per desk while maintaining complete security isolation between the dispatcher PC and the telephone.',
        fieldTrapTitle: 'Untrusted port stripping QoS tags to 0',
        fieldTrapDescription: 'If the switch port lacks "mls qos trust dscp", it resets the voice priority to Best Effort (0). At the first sign of network congestion, emergency dispatch audio will distort.'
      },
      voip_hop_3: {
        title: 'Cisco CallManager (CUCM): SIP Signaling & Call Routing',
        subtitle: 'CUCM validates dialed extension, checks hunt group, and rings available dispatcher',
        locationName: 'City Hall Core Data Center - Rack 02 (Unified Comms)',
        signalDescription: 'SIP signaling (Session Initiation Protocol) over TLS / UDP 5060',
        hardwareName: 'Cisco Unified Communications Manager Cluster',
        hardwareRole: 'Managing extensions, dial plans, external PRI/SIP trunks, and emergency dispatch queues',
        whatHappensHardware: 'CUCM server processes the SIP INVITE. It inspects the dialed number (106), checks agent availability, and rings the target console.',
        whatHappensSoftware: 'Once answered, CUCM sends a 200 OK message containing IP endpoints. From that second onward, RTP audio streams peer-to-peer without traversing CUCM!',
        mentalModelTitle: 'Signaling vs Media: The Matchmaker and the Marriage',
        mentalModelDescription: 'CallManager is only the matchmaker (SIP). Once the call begins, the matchmaker steps aside and both phones converse directly via peer-to-peer RTP.',
        fieldTrapTitle: 'Missing BPDU Guard on phone access ports',
        fieldTrapDescription: 'If an employee plugs a small unmanaged desktop switch into the PC port on the back of the phone, without BPDU Guard a loop will cripple the entire building.'
      }
    }
  },
  voip_106: {
    title: 'Emergency Call 106 Dispatch ➔ Cisco CUCM CallManager Cluster',
    shortDesc: 'End-to-end voice path: acoustic sampling to G.711u codec, Voice VLAN 30 tagging, QoS DSCP EF (Expedited Forwarding), L3 priority routing to Cisco CallManager.',
    sourceLabel: 'Citizen Dispatch Console (Cisco 8845 IP Phone)',
    targetLabel: 'City Hall Core DC (Cisco CUCM Telephony Cluster)',
    totalDistance: '850m Fiber Ring',
    avgLatency: '0.8 ms',
    hops: {
      voip_hop_1: {
        title: 'Acoustic Sampling & G.711u DSP Voice Encoding',
        subtitle: 'Handset microphone samples human voice at 8kHz, packing 20ms RTP packets',
        locationName: 'Dispatch 106 Control Center Desk #04',
        signalDescription: 'Microphone analog audio converted to 64 Kbps uncompressed digital stream',
        hardwareName: 'Enterprise Video IP Phone with Hardware DSP',
        hardwareRole: 'Low-latency voice encoding, hardware acoustic echo cancellation, and SIP signaling',
        whatHappensHardware: 'The phone DSP digitizes voice at 8,000 samples per second with 8-bit precision (G.711u 64Kbps). Every 20ms, it generates a 160-byte payload.',
        whatHappensSoftware: 'The phone encapsulates the audio inside RTP/UDP. Crucially, it marks the IP header with DSCP 46 (EF - Expedited Forwarding) for strict priority.',
        mentalModelTitle: 'Voice cannot tolerate waiting in line',
        mentalModelDescription: 'A web page can load half a second late with no harm, but 50ms of audio delay creates intolerable robotic stutter. Voice packets must jump ahead of all other traffic!',
        fieldTrapTitle: 'Mismatched voice codec causing silent calls',
        fieldTrapDescription: 'If the IP phone tries to negotiate G.729 (compressed) while the SIP Trunk only accepts G.711u, the call will connect but neither side will hear any sound.'
      },
      voip_hop_2: {
        title: 'Voice VLAN & 802.1p CoS Tagging via LLDP-MED',
        subtitle: 'Switch advertises Voice VLAN to phone via LLDP-MED protocol',
        locationName: 'Floor network patch panel at 106 Dispatch building',
        signalDescription: 'Tagged Ethernet frame on shared PC-to-Phone access port',
        hardwareName: 'Cisco Catalyst 9300-48P with StackWise-480',
        hardwareRole: 'Supplying 7W PoE to phone, separating CAD PC data from Voice, and honoring QoS trust',
        whatHappensHardware: 'Phone and switch communicate via LLDP-MED. The switch tells the phone: "Use VLAN 30 for your voice packets, and mark them with 802.1p Priority 5".',
        whatHappensSoftware: 'The PC connected to the back of the phone stays in untagged VLAN 35, while the phone voice stream is tagged in VLAN 30.',
        mentalModelTitle: 'One cable — two isolated parallel worlds',
        mentalModelDescription: 'Voice VLAN allows saving a second cable drop per desk while maintaining complete security isolation between the dispatcher PC and the telephone.',
        fieldTrapTitle: 'Untrusted port stripping QoS tags to 0',
        fieldTrapDescription: 'If the switch port lacks "mls qos trust dscp", it resets the voice priority to Best Effort (0). At the first sign of network congestion, emergency dispatch audio will distort.'
      },
      voip_hop_3: {
        title: 'Cisco CallManager (CUCM): SIP Signaling & Call Routing',
        subtitle: 'CUCM validates dialed extension, checks hunt group, and rings available dispatcher',
        locationName: 'City Hall Core Data Center - Rack 02 (Unified Comms)',
        signalDescription: 'SIP signaling (Session Initiation Protocol) over TLS / UDP 5060',
        hardwareName: 'Cisco Unified Communications Manager Cluster',
        hardwareRole: 'Managing extensions, dial plans, external PRI/SIP trunks, and emergency dispatch queues',
        whatHappensHardware: 'CUCM server processes the SIP INVITE. It inspects the dialed number (106), checks agent availability, and rings the target console.',
        whatHappensSoftware: 'Once answered, CUCM sends a 200 OK message containing IP endpoints. From that second onward, RTP audio streams peer-to-peer without traversing CUCM!',
        mentalModelTitle: 'Signaling vs Media: The Matchmaker and the Marriage',
        mentalModelDescription: 'CallManager is only the matchmaker (SIP). Once the call begins, the matchmaker steps aside and both phones converse directly via peer-to-peer RTP.',
        fieldTrapTitle: 'Missing BPDU Guard on phone access ports',
        fieldTrapDescription: 'If an employee plugs a small unmanaged desktop switch into the PC port on the back of the phone, without BPDU Guard a loop will cripple the entire building.'
      }
    }
  },
  wifi_citizen: {
    title: 'Citizen Smartphone at Ra\'anana Park ➔ Core Internet Gateway',
    shortDesc: 'Wi-Fi 6 (802.11ax) RF transmission, OFDMA subcarriers, Aruba outdoor AP-575, CAPWAP tunnel, Aruba Mobility Controller to FortiGate SD-WAN.',
    sourceLabel: 'Ra\'anana Park Lake / Amphitheater (Citizen Mobile)',
    targetLabel: 'Municipal Internet Edge (FortiGate 200F Gateway)',
    totalDistance: '3.1 km Hybrid Mesh & Fiber',
    avgLatency: '3.2 ms',
    hops: {
      wifi_hop_1: {
        title: '802.11ax Wi-Fi 6 RF Transmission: 5GHz OFDMA & 1024-QAM',
        subtitle: 'Citizen phone connects over radio frequencies, splitting channel into Resource Units',
        locationName: 'Ra\'anana Park Great Lake Boardwalk',
        signalDescription: 'Electromagnetic RF radio waves at 5.2 GHz with 1024-QAM modulation',
        hardwareName: 'Outdoor IP67 Wi-Fi 6 Access Point',
        hardwareRole: 'Serving up to 500 simultaneous park visitors with high-density beamforming antennas',
        whatHappensHardware: 'The phone transceives data via Wi-Fi 6 OFDMA. The Access Point groups multiple park users into micro Resource Units (RU) within the same 80MHz channel.',
        whatHappensSoftware: 'The client sends an 802.11 association frame. The AP maps the visitor to Guest-WiFi VLAN 80 and assigns a captive portal lease.',
        mentalModelTitle: 'Wi-Fi is a shared conference room',
        mentalModelDescription: 'Unlike wired cables where each device has a dedicated wire, in Wi-Fi everyone speaks in the same room. Wi-Fi 6 turns a chaotic shouting room into an orderly synchronized choir.',
        fieldTrapTitle: 'Over-boosting AP transmit power (Sticky Client)',
        fieldTrapDescription: 'If an outdoor AP transmits at maximum 30 dBm, citizen phones can hear it from 150 meters away, but their tiny antennas cannot transmit back, causing high packet loss!'
      },
      wifi_hop_2: {
        title: 'CAPWAP Tunnel: Encapsulating Wi-Fi into Core Controller',
        subtitle: 'All wireless traffic is tunneled securely inside UDP port 5247 to City Hall',
        locationName: 'Aruba Mobility Controller 7210 in Core DC',
        signalDescription: 'CAPWAP encapsulated tunnel frames over campus fiber trunk',
        hardwareName: 'Aruba 7210 Enterprise Mobility Controller',
        hardwareRole: 'Centralized RF management, client roaming, firewall enforcement, and bandwidth limits',
        whatHappensHardware: 'The outdoor AP wraps client 802.11 frames inside Layer 3 CAPWAP UDP packets, routing them directly through the city fiber network to the controller.',
        whatHappensSoftware: 'The Aruba controller terminates the tunnel, enforces guest isolation (preventing visitors from scanning municipal servers), and throttles download speeds.',
        mentalModelTitle: 'CAPWAP is an armored pipeline across town',
        mentalModelDescription: 'Even though the citizen is sitting 3 kilometers away in the park, their data exits the controller in City Hall as if they were plugged into a switch port in the server room.',
        fieldTrapTitle: 'MTU Black Hole on CAPWAP Tunnel',
        fieldTrapDescription: 'Because CAPWAP adds a 44-byte tunnel header, if intermediate fiber switches drop packets exceeding standard 1500-byte MTU, web pages will hang indefinitely!'
      }
    }
  },
  park_wifi: {
    title: 'Citizen Smartphone at Ra\'anana Park ➔ Core Internet Gateway',
    shortDesc: 'Wi-Fi 6 (802.11ax) RF transmission, OFDMA subcarriers, Aruba outdoor AP-575, CAPWAP tunnel, Aruba Mobility Controller to FortiGate SD-WAN.',
    sourceLabel: 'Ra\'anana Park Lake / Amphitheater (Citizen Mobile)',
    targetLabel: 'Municipal Internet Edge (FortiGate 200F Gateway)',
    totalDistance: '3.1 km Hybrid Mesh & Fiber',
    avgLatency: '3.2 ms',
    hops: {
      wifi_hop_1: {
        title: '802.11ax Wi-Fi 6 RF Transmission: 5GHz OFDMA & 1024-QAM',
        subtitle: 'Citizen phone connects over radio frequencies, splitting channel into Resource Units',
        locationName: 'Ra\'anana Park Great Lake Boardwalk',
        signalDescription: 'Electromagnetic RF radio waves at 5.2 GHz with 1024-QAM modulation',
        hardwareName: 'Outdoor IP67 Wi-Fi 6 Access Point',
        hardwareRole: 'Serving up to 500 simultaneous park visitors with high-density beamforming antennas',
        whatHappensHardware: 'The phone transceives data via Wi-Fi 6 OFDMA. The Access Point groups multiple park users into micro Resource Units (RU) within the same 80MHz channel.',
        whatHappensSoftware: 'The client sends an 802.11 association frame. The AP maps the visitor to Guest-WiFi VLAN 80 and assigns a captive portal lease.',
        mentalModelTitle: 'Wi-Fi is a shared conference room',
        mentalModelDescription: 'Unlike wired cables where each device has a dedicated wire, in Wi-Fi everyone speaks in the same room. Wi-Fi 6 turns a chaotic shouting room into an orderly synchronized choir.',
        fieldTrapTitle: 'Over-boosting AP transmit power (Sticky Client)',
        fieldTrapDescription: 'If an outdoor AP transmits at maximum 30 dBm, citizen phones can hear it from 150 meters away, but their tiny antennas cannot transmit back, causing high packet loss!'
      },
      wifi_hop_2: {
        title: 'CAPWAP Tunnel: Encapsulating Wi-Fi into Core Controller',
        subtitle: 'All wireless traffic is tunneled securely inside UDP port 5247 to City Hall',
        locationName: 'Aruba Mobility Controller 7210 in Core DC',
        signalDescription: 'CAPWAP encapsulated tunnel frames over campus fiber trunk',
        hardwareName: 'Aruba 7210 Enterprise Mobility Controller',
        hardwareRole: 'Centralized RF management, client roaming, firewall enforcement, and bandwidth limits',
        whatHappensHardware: 'The outdoor AP wraps client 802.11 frames inside Layer 3 CAPWAP UDP packets, routing them directly through the city fiber network to the controller.',
        whatHappensSoftware: 'The Aruba controller terminates the tunnel, enforces guest isolation (preventing visitors from scanning municipal servers), and throttles download speeds.',
        mentalModelTitle: 'CAPWAP is an armored pipeline across town',
        mentalModelDescription: 'Even though the citizen is sitting 3 kilometers away in the park, their data exits the controller in City Hall as if they were plugged into a switch port in the server room.',
        fieldTrapTitle: 'MTU Black Hole on CAPWAP Tunnel',
        fieldTrapDescription: 'Because CAPWAP adds a 44-byte tunnel header, if intermediate fiber switches drop packets exceeding standard 1500-byte MTU, web pages will hang indefinitely!'
      }
    }
  },
  dai_security: {
    title: 'Lateral Movement Cyber Attack ➔ Dynamic ARP Inspection (DAI) Block',
    shortDesc: 'A neutralised malicious packet journey: ransomware-infected host launches ARP spoofing & SMB sweeps, the access switch checks DHCP Snooping, blocks port and alerts SIEM.',
    sourceLabel: 'Infected Worker PC (Welfare Bldg)',
    targetLabel: 'Catalyst Access Switch (DAI Hardware Drop) ➔ SIEM/SOC',
    totalDistance: 'Blocked at first access port (Zero Trust)',
    avgLatency: '< 0.1 ms (Hardware Rate Limiter)',
    hops: {
      sec_hop_1: {
        title: 'Infected PC Launches ARP Spoofing & SMB Port 445 Sweep',
        subtitle: 'Ransomware attempts to hijack default gateway MAC address to sniff credentials',
        locationName: 'Social Welfare department office wall jack',
        signalDescription: 'High-frequency burst of unsolicited Gratuitous ARP packets',
        hardwareName: 'HP EliteDesk Workstation Infected via USB',
        hardwareRole: 'Compromised host attempting lateral movement across the municipal network',
        whatHappensHardware: 'PC NIC floods the switch with malicious ARP frames declaring that the default gateway IP belongs to the attacker MAC.',
        whatHappensSoftware: 'The PC issues gratuitous ARP replies to poison neighbor ARP caches.',
        mentalModelTitle: 'ARP Spoofing: Impersonating a Traffic Cop at an Intersection',
        mentalModelDescription: 'In legacy ARP, anyone can claim "I am the router". Dynamic ARP Inspection acts as an ID check to verify legitimacy before passing any packet.',
        fieldTrapTitle: 'Enabling DAI without Trusting the Uplink',
        fieldTrapDescription: 'If an engineer turns on DAI and forgets "ip arp inspection trust" on the uplink to the core router, the switch will block the real router and disconnect all users!'
      }
    }
  },
  quarantine_8021x: {
    title: 'Rogue Laptop Plugged in at Welfare Dept ➔ 802.1X Port Quarantine',
    shortDesc: 'Zero-Trust security in action: EAPoL identity challenge, Cisco ISE RADIUS verification failure, Change of Authorization (CoA), and automated port isolation into Quarantine VLAN 999.',
    sourceLabel: 'Public Welfare Office Desk (Rogue Device)',
    targetLabel: 'Cisco ISE Policy Server & Quarantine Isolation VLAN',
    totalDistance: '1.2 km Campus Trunk',
    avgLatency: '1.9 ms',
    hops: {
      quarantine_hop_1: {
        title: 'Physical Link Up & EAPoL Identity Challenge',
        subtitle: 'Switch detects link, blocks all traffic except 802.1X, and demands credentials',
        locationName: 'Social Welfare department office wall jack',
        signalDescription: 'EAP over LAN (EAPoL) handshake on unauthorized port',
        hardwareName: 'Cisco Catalyst 9300-48T Security Access Switch',
        hardwareRole: 'Port security gatekeeper, preventing MAC spoofing and rogue router attachment',
        whatHappensHardware: 'When the laptop plugs in, the switch ASIC leaves the port in "Unauthorized" state. All IPv4, ARP, and ICMP traffic is blocked at the hardware level.',
        whatHappensSoftware: 'The switch sends an EAPoL-Request/Identity frame. It begins a 30-second timer waiting for certificate or 802.1X credential validation.',
        mentalModelTitle: 'The Port is a locked security turnstile',
        mentalModelDescription: 'Before you show a valid municipal employee badge, the turnstile does not budge. No packet can pass through to the rest of the city network.',
        fieldTrapTitle: 'Connecting non-802.1X printers or IP cameras',
        fieldTrapDescription: 'Legacy IoT hardware cannot supply 802.1X certificates. If MAC Authentication Bypass (MAB) is not configured, the printer will be permanently locked out!'
      },
      quarantine_hop_2: {
        title: 'Cisco ISE RADIUS Evaluation & CoA Quarantine Push',
        subtitle: 'Policy server rejects device and triggers Change of Authorization (CoA)',
        locationName: 'City Hall Core DC (Cisco ISE Cluster)',
        signalDescription: 'RADIUS Access-Reject and RFC 5176 CoA Port Reconfigure',
        hardwareName: 'Cisco Identity Services Engine (ISE) Cluster',
        hardwareRole: 'Contextual network access policy, endpoint profiling, and automated threat quarantine',
        whatHappensHardware: 'ISE receives the RADIUS request. Noticing an untrusted device without municipal certificates, it sends a CoA (Change of Authorization) packet to the switch.',
        whatHappensSoftware: 'The switch changes port assignment to VLAN 999 (Quarantine / Remediation), locking the rogue laptop into a sandbox with zero access to municipal servers.',
        mentalModelTitle: 'Guilty until proven innocent',
        mentalModelDescription: '802.1X zero-trust treats every cable connection as potentially hostile until cryptographic certificates verify the device identity.',
        fieldTrapTitle: 'RADIUS server timeout fallback to open access',
        fieldTrapDescription: 'If both primary and secondary ISE servers become unreachable and "critical auth" is misconfigured to open, a network-wide security bypass occurs!'
      }
    }
  }
};

// Localizer Helpers
export function getLocalizedNode(node: LearningNode, lang: Language): LearningNode {
  if (lang === 'he') return node;
  const en = EN_NODE_MAP[node.id];
  if (!en) return node;

  return {
    ...node,
    title: en.title || node.title,
    subtitle: en.subtitle || node.subtitle,
    categoryLabel: en.categoryLabel || node.categoryLabel,
    summary: en.summary || node.summary
  };
}

export function getLocalizedZone(zone: ElevationZone, lang: Language): ElevationZone {
  if (lang === 'he') return zone;
  const en = EN_ELEVATION_ZONES[zone.elevation];
  if (!en) return zone;

  return {
    ...zone,
    name: en.name || zone.name,
    subtitle: en.subtitle || zone.subtitle,
    description: en.description || zone.description
  };
}

export function getLocalizedScenario(scenario: PathScenario, lang: Language): PathScenario {
  if (lang === 'he') return scenario;
  const en = EN_SCENARIOS[scenario.id];
  if (!en) return scenario;

  const localizedHops = scenario.hops.map((hop) => {
    const enHop = en.hops?.[hop.id];
    if (!enHop) return hop;

    return {
      ...hop,
      title: enHop.title || hop.title,
      subtitle: enHop.subtitle || hop.subtitle,
      locationName: enHop.locationName || hop.locationName,
      signalDescription: enHop.signalDescription || hop.signalDescription,
      hardwareName: enHop.hardwareName || hop.hardwareName,
      hardwareRole: enHop.hardwareRole || hop.hardwareRole,
      whatHappensHardware: enHop.whatHappensHardware || hop.whatHappensHardware,
      whatHappensSoftware: enHop.whatHappensSoftware || hop.whatHappensSoftware,
      mentalModelTitle: enHop.mentalModelTitle || hop.mentalModelTitle,
      mentalModelDescription: enHop.mentalModelDescription || hop.mentalModelDescription,
      fieldTrapTitle: enHop.fieldTrapTitle || hop.fieldTrapTitle,
      fieldTrapDescription: enHop.fieldTrapDescription || hop.fieldTrapDescription
    };
  });

  return {
    ...scenario,
    title: en.title || scenario.title,
    shortDesc: en.shortDesc || scenario.shortDesc,
    sourceLabel: en.sourceLabel || scenario.sourceLabel,
    targetLabel: en.targetLabel || scenario.targetLabel,
    totalDistance: en.totalDistance || scenario.totalDistance,
    avgLatency: en.avgLatency || scenario.avgLatency,
    hops: localizedHops
  };
}

export function getLocalizedSite(site: MunicipalSite, lang: Language): MunicipalSite {
  if (lang === 'he') return site;
  const en = EN_SITES_MAP[site.id];
  if (!en) return site;

  return {
    ...site,
    name: en.name || site.name,
    role: en.role || site.role,
    address: en.address || site.address
  };
}
