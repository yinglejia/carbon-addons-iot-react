import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Tree16 } from '@carbon/icons-react';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import Table from '../Table/Table';

import Card from './Card';

export const getDataStateProp = () => ({
  label: text(
    'dataState : Label',
    'No data available for this score at this time'
  ),
  description: text(
    'dataState : Description',
    'The last successful score was 68 at 13:21 - 10/21/2019 but wait, there is more, according to the latest test results this line is too long.'
  ),
  extraTooltipText: text(
    'dataState : ExtraTooltipText',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  ),
  learnMoreElement: (
    <a className="bx--link" href="#top">
      Learn more
    </a>
  ),
});

storiesOf('Watson IoT/Card', module)
  .add('basic', () => {
    const StatefulExample = () => {
      const [selected, setSelected] = React.useState(false);
      const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
      const handleClick = () => {
        setSelected(true);
      };
      const handleBlur = (e) => {
        if (
          !e.currentTarget.contains(e.relatedTarget) ||
          (e.target === e.currentTarget && e.relatedTarget === null)
        ) {
          setSelected(false);
        }
        action('onBlur');
      };
      return (
        <div style={{ width: text('width', `450px`), margin: 20 }}>
          <Card
            title={text('title', 'Card Title')}
            id="facilitycard-basic"
            size={size}
            isLoading={boolean('isloading', false)}
            isSelected={selected}
            isEmpty={boolean('isEmpty', false)}
            isEditable={boolean('isEditable', false)}
            isExpanded={boolean('isExpanded', false)}
            breakpoint="lg"
            availableActions={{ range: true, expand: true }}
            onCardAction={action('onCardAction')}
            onFocus={action('onFocus')}
            onBlur={handleBlur}
            tabIndex={0}
            onClick={handleClick}
          />
        </div>
      );
    };
    return <StatefulExample />;
  })
  .add('with ellipsed title tooltip & external tooltip', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text(
            'title',
            'Card Title that should be truncated and presented in a tooltip while the cards also has an external tooltip.'
          )}
          id="facilitycard-basic"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          availableActions={{ range: true, expand: true }}
          onCardAction={action('onCardAction')}
          tooltip={<p>this is the external tooltip content</p>}
        />
      </div>
    );
  })
  .add('basic with render prop', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card with render prop')}
          id="render-prop-basic"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          availableActions={{ range: true, expand: true }}
          onCardAction={action('onCardAction')}
          // eslint-disable-next-line react/no-children-prop
          children={(childSize) => (
            <p>
              Content width is {childSize.width} and height is{' '}
              {childSize.height}
            </p>
          )}
        />
      </div>
    );
  })
  .add('with loading', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', true)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('with range selector', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
          availableActions={{
            range: true,
          }}
        />
      </div>
    );
  })
  .add('with custom range selector', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
          availableActions={{
            range: true,
          }}
          timeRangeOptions={object('timeRangeOptions', {
            last8Hours: 'Last 8 Hours',
            last4Hours: 'Last 4 Hours',
            last2Hours: 'Last 2 Hours',
            lastHour: 'Last Hour',
            this8Hours: 'This 8 Hours',
            this4Hours: 'This 4 Hours',
            this2Hours: 'This 2 Hours',
            thisHour: 'This Hour',
          })}
        />
      </div>
    );
  })
  .add('is editable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', true)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
          availableActions={{
            edit: true,
            clone: true,
            delete: true,
          }}
        />
      </div>
    );
  })
  .add('is expandable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
          availableActions={{
            expand: true,
          }}
        />
      </div>
    );
  })
  .add('is expandable - custom expand icon', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          renderExpandIcon={Tree16}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
          availableActions={{
            expand: true,
          }}
        />
      </div>
    );
  })
  .add('with empty state', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-empty"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', true)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          availableActions={{ range: true }}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('size gallery', () => {
    return Object.keys(CARD_SIZES).map((i) => (
      <React.Fragment key={`card-${i}`}>
        <h3>{i}</h3>
        <div
          style={{
            width: `${getCardMinSize('lg', CARD_SIZES[i]).x}px`,
            margin: 20,
          }}>
          <Card
            title={text('title', 'Card Title')}
            id={`facilitycard-size-gallery-${i}`}
            size={CARD_SIZES[i]}
            isLoading={boolean('isLoading', false)}
            isEmpty={boolean('isEmpty', true)}
            isEditable={boolean('isEditable', false)}
            isExpanded={boolean('isExpanded', false)}
            breakpoint="lg"
            availableActions={{ range: i !== CARD_SIZES.SMALL }}
            onCardAction={action('onCardAction')}
          />
        </div>
      </React.Fragment>
    ));
  })
  .add('error', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-error"
          size={size}
          error={text('error', 'API threw Nullpointer')}
          isLoading={boolean('isLoading', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('error/small', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-error-small"
          size={size}
          error={text('error', 'API threw Nullpointer')}
          isLoading={boolean('isLoading', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add(
    'implementing a custom card',
    () => {
      const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
      const SampleCustomCard = ({ title, isEditable, ...others }) => (
        <Card {...others} hideHeader>
          {!isEditable
            ? (_$, { cardToolbar, values }) => (
                <Table
                  id="my table"
                  secondaryTitle={title}
                  columns={[
                    {
                      id: 'value1',
                      name: 'String',
                      filter: { placeholderText: 'enter a string' },
                    },
                    {
                      id: 'timestamp',
                      name: 'Date',
                      filter: { placeholderText: 'enter a date' },
                    },
                  ]}
                  data={values.map((value, index) => ({
                    id: `rowid-${index}`,
                    values: value,
                  }))}
                  view={{ toolbar: { customToolbarContent: cardToolbar } }}
                />
              )
            : 'Fake Sample Data'}
        </Card>
      );

      return (
        <SampleCustomCard
          id="mycard"
          title={text('title', 'Card Title')}
          size={size}
          isEditable={boolean('isEditable', false)}
          values={[{ timestamp: 12341231231, value1: 'my value' }]}
          availableActions={{ range: size !== CARD_SIZES.SMALL, expand: true }}
          onCardAction={action('onCardAction')}
        />
      );
    },
    {
      inline: true,
      source: true,
      info: {
        text: `
      To develop a custom card component.
       - Create a new card component that uses the base Card component
       - See the simple SampleCustomCard in the source code of this story for an example
       - If you want to hide the title/toolbar, do not pass a title prop
       - (Optionally, if you want to use the card in a Dashboard) Extend the Card Renderer so the Dashboard knows how to render your card type
       - (Optionally, if you want to use the card in a Dashboard) Create a validator for this card type within "utils/schemas/validators" and add it to the validateDashboardJSON function used to validate dashboards on import.

       ## Data flow for a card in the dashboard
       All data loading for a card goes through the dashboard's onFetchData function.  There are two ways to trigger a refetch of data for a card.  The first is to directly interact
       with the Card's range controls.  The second is for the Dashboard to trigger that all of the cards need a reload by updating it's isLoading bit.  The CardRenderer component will call the onSetupCard function of the dashboard first
       for each card (if it exists), then will call the onFetchData function for the dashboard.
       `,
      },
    }
  );
