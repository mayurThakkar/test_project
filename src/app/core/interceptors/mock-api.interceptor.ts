import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay, throwError } from 'rxjs';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('/api/login') && req.method === 'POST') {
    const body = req.body as any;

    if (body.email === 'admin@example.com' && body.password === 'password123') {
      const response = new HttpResponse({
        status: 200,
        body: {
          token: 'mock-jwt-token-' + Date.now(),
          user: { email: body.email },
        },
      });
      return of(response).pipe(delay(1000));
    } else {
      return throwError(() => ({
        status: 401,
        error: { message: 'Invalid email or password' },
      })).pipe(delay(500));
    }
  }

  if (req.url.endsWith('/api/items') && req.method === 'GET') {
    const mockInventoryItems = [
      {
        id: 1001,
        name: 'MacBook Pro 16-inch',
        description:
          'Apple MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD. Perfect for development work, video editing, and professional tasks. Space Gray color with excellent battery life.',
      },
      {
        id: 1002,
        name: 'Dell UltraSharp 27" Monitor',
        description:
          'Dell UltraSharp U2723QE 27-inch 4K USB-C Hub Monitor. Features IPS technology, 99% sRGB color coverage, built-in KVM switch, and multiple connectivity options for productivity.',
      },
      {
        id: 1003,
        name: 'Logitech MX Master 3S Wireless Mouse',
        description:
          'Advanced wireless mouse with precision tracking, customizable buttons, and ultra-fast scrolling. Ergonomic design with up to 70 days battery life. Compatible with multiple devices.',
      },
      {
        id: 1004,
        name: 'Herman Miller Aeron Chair',
        description:
          'Ergonomic office chair with PostureFit SL lumbar support, breathable mesh material, and 12-year warranty. Size B, graphite color. Designed for 8+ hour work sessions.',
      },
      {
        id: 1005,
        name: 'iPhone 15 Pro Max',
        description:
          'Latest iPhone with A17 Pro chip, 256GB storage, Pro camera system with 5x telephoto zoom, Action Button, and titanium design. Natural Titanium color with USB-C connectivity.',
      },
      {
        id: 1006,
        name: 'Sony WH-1000XM5 Headphones',
        description:
          'Premium wireless noise-canceling headphones with industry-leading noise cancellation, 30-hour battery life, and crystal-clear call quality. Perfect for focused work and travel.',
      },
      {
        id: 1007,
        name: 'Samsung 49" Odyssey G9 Gaming Monitor',
        description:
          'Ultra-wide curved gaming monitor with 240Hz refresh rate, 1ms response time, HDR10+ support, and QLED technology. Ideal for gaming and multi-tasking workflows.',
      },
      {
        id: 1008,
        name: 'Mechanical Keyboard - Keychron K8',
        description:
          'Wireless mechanical keyboard with hot-swappable switches, RGB backlighting, and Mac/Windows compatibility. Gateron Brown switches for tactile typing experience.',
      },
      {
        id: 1009,
        name: 'Standing Desk - UPLIFT V2',
        description:
          '60" x 30" electric standing desk with memory presets, cable management, and solid wood desktop. Height range 25.3" - 50.9" with advanced collision detection.',
      },
      {
        id: 1010,
        name: 'iPad Pro 12.9" with Magic Keyboard',
        description:
          'iPad Pro with M2 chip, 128GB storage, Liquid Retina XDR display, and Magic Keyboard combo. Perfect for creative work, note-taking, and portable productivity.',
      },
      {
        id: 1011,
        name: 'Webcam - Logitech Brio 4K Pro',
        description:
          'Professional 4K webcam with HDR, auto-focus, and Windows Hello support. Features background replacement, zoom certification, and premium glass lens for crystal-clear video calls.',
      },
      {
        id: 1012,
        name: 'Desk Lamp - BenQ ScreenBar Halo',
        description:
          'Monitor light bar with asymmetric lighting, wireless controller, and auto-dimming sensor. Reduces screen glare and eye strain during long work sessions.',
      },
      {
        id: 1013,
        name: 'External SSD - Samsung T7 Shield 2TB',
        description:
          'Rugged portable SSD with 1,050MB/s transfer speeds, IP65 water and dust resistance, and USB 3.2 Gen2 interface. Ideal for backup and file transfers.',
      },
      {
        id: 1014,
        name: 'Printer - HP OfficeJet Pro 9015e',
        description:
          'All-in-one wireless printer with print, scan, copy, and fax capabilities. Features automatic two-sided printing, mobile printing support, and 6 months of HP+ included.',
      },
      {
        id: 1015,
        name: 'Docking Station - CalDigit TS4',
        description:
          'Thunderbolt 4 dock with 18 ports including multiple USB-A/C, HDMI, DisplayPort, Ethernet, and SD card slots. Single cable solution for laptop connectivity.',
      },
      {
        id: 1016,
        name: 'Whiteboard - VIVO Mobile Glass Board',
        description:
          'Mobile magnetic glass whiteboard 48" x 36" with aluminum frame, smooth-rolling casters, and premium markers included. Perfect for brainstorming and presentations.',
      },
      {
        id: 1017,
        name: 'Coffee Machine - Nespresso Vertuo Plus',
        description:
          'Single-serve coffee maker with centrifusion technology, automatic blend recognition, and movable water tank. Includes 12 complimentary coffee capsules.',
      },
      {
        id: 1018,
        name: 'Router - ASUS AX6000 WiFi 6',
        description:
          'High-performance WiFi 6 router with 6000 Mbps speeds, 8 Gigabit LAN ports, adaptive QoS, and AiMesh support for whole-home coverage.',
      },
    ];

    const response = new HttpResponse({
      status: 200,
      body: mockInventoryItems,
    });
    return of(response).pipe(delay(800));
  }

  return next(req);
};
