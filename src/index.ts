import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppData, CatalogChangeEvent, IOrderForm } from './components/AppData';
import { LarekAPI } from './components/LarekAPI';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/Events';
import { ContactOrderForm, DeliveryOrderForm } from './components/Order';
import { Basket } from './components/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/Success';
import './scss/styles.scss';
import { ICardItem, IOrder, EventTypes } from './types';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL)
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const appData = new AppData({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryOrderForm = new DeliveryOrderForm(cloneTemplate(orderTemplate), events);
const contactOrderForm = new ContactOrderForm(cloneTemplate(contactsTemplate), events)

// Загрузка карточек с сервера
api.getCardList()
  .then(appData.setCatalog.bind(appData))
  .catch((err) => {
    console.error(err);
  });

// Блокировка прокрутки при открытой модалке
events.on(EventTypes.MODAL_OPEN, () => {
  page.locked = true;
});

// Разблокировка
events.on(EventTypes.MODAL_CLOSE, () => {
  page.locked = false;
});

// Измения в каталоге
events.on<CatalogChangeEvent>(EventTypes.ITEMS_CHANGED, () => {
  page.catalog = appData.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit(EventTypes.CARD_SELECT, item)
    });
    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price,
    });
  });
});

// Превью карточки
events.on(EventTypes.CARD_SELECT, (item: ICardItem) => {
  appData.setPreview(item);
});

// Изменение превью
events.on(EventTypes.PREVIEW_CHANGED, (item: ICardItem) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (!item.inBasket) {
        events.emit(EventTypes.BASKET_ADD, item);
      }
    }
  });
  
  modal.render({
    content: card.render({
      category: item.category,
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      inBasket: item.inBasket,
    })
  })
  if (item.price === null) {
    card.disableButton(true)
  }
});

// Изменение корзины
events.on(EventTypes.BASKET_CHANGED, (items: ICardItem[]) => {
  basket.items = items.map((item, index) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit(EventTypes.PRODUCT_DELETE, item),
          (item.inBasket = false),
          appData.removeFromBasket(item);
        page.counter = appData.basket.length;
      },
    });
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: `${index + 1}`,
    });
  });
  basket.total = appData.getTotalPrice();
  appData.order.total = appData.getTotalPrice();
});

// Добавить в корзину
events.on(EventTypes.BASKET_ADD, (item: ICardItem) => {
  item.inBasket = true;
  appData.addToBasket(item);
  page.counter = appData.basket.length;
  modal.closeModal();
});

// Удалить из корзины
events.on(EventTypes.PRODUCT_DELETE, (item: ICardItem) => {
  item.inBasket = false;
  appData.removeFromBasket(item);
  page.counter = appData.basket.length;
});

// Открыть корзину
events.on(EventTypes.BASKET_OPEN, () => {
  modal.render({
    content: basket.render({}),
  });
});

// Открыть форму заказа
events.on(EventTypes.ORDER_OPEN, () => {
  modal.render({
    content: deliveryOrderForm.render({
      payment: 'card',
      address: '',
      valid: false,
      errors: [],
    }),
  });
});

// Ошибки формы
events.on(EventTypes.FORM_ERRORS_CHANGE, (errors: Partial<IOrder>) => {
  const { payment, address, email, phone } = errors;

  deliveryOrderForm.valid = !payment && !address;
  deliveryOrderForm.errors = Object.values({ payment, address }).filter((i) => !!i);

  contactOrderForm.valid = !email && !phone;
  contactOrderForm.errors = Object.values({ email, phone }).filter((i) => !!i);
});

// Изменение поля заказа
events.on(
  /^order\..*:change/,
  (data: { field: keyof IOrderForm; value: string }) => {
    appData.setOrderField(data.field, data.value);
  }
);

// Изменение поля контактов
events.on(
  /^contacts\..*:change/,
  (data: { field: keyof IOrderForm; value: string }) => {
    appData.setContactField(data.field, data.value);
  }
);

events.on(EventTypes.ORDER_READY, () => {
  deliveryOrderForm.valid = true;
});

events.on(EventTypes.ORDER_SUBMIT, () => {
  modal.render({
    content: contactOrderForm.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
    }),
  });
})

events.on(EventTypes.CONTACTS_READY, () => {
  contactOrderForm.valid = true;
});

// Отправка формы заказа
events.on(EventTypes.CONTACTS_SUBMIT, () => {
  appData.orderData();
  const orderWithItems = {
    ...appData.order,
    items: appData.basket.map(item => item.id)
  };

  api.orderCards(orderWithItems)
    .then((res) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.closeModal();
        },
      });
      appData.resetOrderForm();
      appData.clearBasket();
      page.counter = appData.basket.length;
      success.result = res.total.toString();
      modal.render({
        content: success.render({}),
      });
    })
    .catch((err) => {
      console.error('Ошибка при отправке заказа:', err);
    });
});

