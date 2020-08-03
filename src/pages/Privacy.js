import React from 'react';
import { Card } from 'antd';

export default function Privacy() {

  return (
    <div>
        <div className="Main">
          <Card title="Privacy Policy" className="PrivacyCard">
            <h5>
              Header #1
            </h5>
            <p>
              Some legal jargon.
            </p>
            <p>
              Some extra information that everyone reads.
            </p>
            <h5>
              Header #2
            </h5>
            <p>
              Some more legal jargon.
            </p>
          </Card>
        </div>
      </div>
  );
}
